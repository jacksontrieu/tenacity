module Commands
  module Passwords
    class UpdatePassword < Rectify::Command
      def initialize(form, requesting_user)
        @form = form
        @requesting_user = requesting_user
      end

      def call
        return broadcast(:invalid, @form.errors) if @form.invalid?

        return broadcast(:not_permitted, 'Not allowed to update the password for the specified user.') if @form.id != @requesting_user.id

        unless @requesting_user.valid_password?(@form.current_password)
          return broadcast(:invalid, { current_password: 'is not valid, please try again' })
        end

        unless @form.new_password == @form.confirm_password
          return broadcast(:invalid, { new_password: "doesn't match confirm password" })
        end

        @requesting_user.password = @form.new_password
        @requesting_user.save

        return broadcast(:invalid, @requesting_user.errors) unless @requesting_user.valid?

        return broadcast(:ok, @requesting_user)
      end
    end
  end
end
