module Commands
  module Registrations
    class UpdateUser < Rectify::Command
      include ArrayHelper

      def initialize(form, request_user)
        @form = form
        @request_user = request_user
      end

      def call
        return broadcast(:invalid, squash_strings(@form.errors.full_messages)) if @form.invalid?

        user = User.find_by(id: @form.id)
        return broadcast(:invalid, "Could not find user with id #{@form.id}.") if user.nil?

        # Check that logged in user has permissions to update the specified
        # user's details.
        return broadcast(:not_permitted) unless @request_user.can_access_user?(user)

        user.first_name = @form.first_name
        user.last_name = @form.last_name
        user.phone = @form.phone
        user.save

        return broadcast(:invalid, squash_strings(user.errors.full_messages)) if user.invalid?

        return broadcast(:ok)
      end
    end
  end
end
