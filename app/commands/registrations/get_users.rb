module Commands
  module Registrations
    class GetUsers < Rectify::Command
      include ArrayHelper

      def initialize(form, requesting_user)
        @form = form
        @requesting_user = requesting_user
      end

      def call
        return broadcast(:invalid, squash_strings(@form.errors.full_messages)) if @form.invalid?

        # Check that logged in user has permissions to manage all users.
        return broadcast(:not_permitted) unless @requesting_user.can?(:manage, :all_users)

        users = User.select(:id, :first_name, :last_name, :phone)
                    .page(@form.page_number)
                    .per(@form.page_size)
                    .order(:first_name, :last_name)

        return broadcast(:ok, users)
      end
    end
  end
end
