module Commands
  module Passwords
    class UpdatePassword < Rectify::Command
      include ArrayHelper

      def initialize(form, requesting_user)
        @form = form
        @requesting_user = requesting_user
      end

      def call
        return broadcast(:invalid, squash_strings(@form.errors.full_messages)) if @form.invalid?

        return broadcast(:not_permitted, 'Not allowed to update the password for the specified user.') if @form.id != @requesting_user.id

        unless @requesting_user.valid_password?(@form.current_password)
          return broadcast(:invalid, 'The current password was not valid, please try again.')
        end

        unless @form.new_password == @form.confirm_password
          return broadcast(:invalid, "The new password doesn't match.")
        end

        @requesting_user.password = @form.new_password
        @requesting_user.save

        return broadcast(:invalid, @requesting_user.errors.full_messages) unless @requesting_user.valid?

        return broadcast(:ok, @requesting_user)
      end
    end
  end
end
