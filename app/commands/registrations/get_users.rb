module Commands
  module Registrations
    class GetUsers < Rectify::Command
      include ArrayHelper

      def initialize(form, request_user)
        @form = form
        @request_user = request_user
      end

      def call
        return broadcast(:invalid, squash_strings(@form.errors.full_messages)) if @form.invalid?

        # Check that logged in user has permissions to manage all users.
        return broadcast(:not_permitted) unless @request_user.can?(:manage, :all_users)

        users = User.select(:id, :first_name, :last_name, :phone)
                    .order(:first_name, :last_name)
                    .limit(@form.page_size)
                    .page(@form.page_number)

        return broadcast(:ok, users)
      end
    end
  end
end
