module Commands
  module Registrations
    class GetUser < Rectify::Command
      include ArrayHelper

      def initialize(form, request_user)
        @form = form
        @request_user = request_user
      end

      def call
        return broadcast(:invalid, squash_strings(@form.errors.full_messages)) if @form.invalid?

        user = User.where(id: @form.id)
                   .select(:id, :email, :first_name, :last_name, :phone)
                   .first
        return broadcast(:invalid, "Could not find user with id #{@form.id}.") if user.nil?

        # Check that logged in user has permissions to access the specified
        # user's details.
        return broadcast(:not_permitted) unless @request_user.can_access_user?(user)

        return broadcast(:ok, user)
      end
    end
  end
end
