module Commands
  module Registrations
    class UpdateUser < Rectify::Command
      def initialize(form, requesting_user)
        @form = form
        @requesting_user = requesting_user
      end

      def call
        return broadcast(:invalid, @form.errors) if @form.invalid?

        user = User.find_by(id: @form.id)
        return broadcast(:record_not_found, "Could not find user with id #{@form.id}.") if user.nil?

        # Check that logged in user has permissions to update the specified
        # user's details.
        return broadcast(:not_permitted) unless @requesting_user.can_access_user?(user)

        user.first_name = @form.first_name
        user.last_name = @form.last_name
        user.phone = @form.phone
        user.save

        return broadcast(:invalid, user.errors) if user.invalid?

        return broadcast(:ok, user)
      end
    end
  end
end
