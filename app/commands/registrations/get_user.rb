module Commands
  module Registrations
    class GetUser < Rectify::Command
      include ArrayHelper

      def initialize(form, requesting_user)
        @form = form
        @requesting_user = requesting_user
      end

      def call
        return broadcast(:invalid, squash_strings(@form.errors.full_messages)) if @form.invalid?

        requested_user = User.where(id: @form.id)
                             .select(:id, :email, :first_name, :last_name, :phone)
                             .first
        return broadcast(:invalid, "Could not find user with id #{@form.id}.") if requested_user.nil?

        # Check that logged in user has permissions to access the specified
        # user's details.
        return broadcast(:not_permitted) unless @requesting_user.can_access_user?(requested_user)

        return broadcast(:ok, requested_user)
      end
    end
  end
end
