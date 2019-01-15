module Commands
  module Registrations
    class GetUsers < Rectify::Command
      def initialize(form, requesting_user)
        @form = form
        @requesting_user = requesting_user
      end

      def call
        return broadcast(:invalid, @form.errors) if @form.invalid?

        # Check that logged in user has permissions to manage all users.
        return broadcast(:not_permitted) unless @requesting_user.can?(:manage, :all_users)

        users = User.select(:id, :email, :first_name, :last_name, :phone)
                    .page(@form.page_number)
                    .per(@form.page_size)
                    .order(:first_name, :last_name)

        total_count = User.all.count
        total_pages = @form.page_size.zero? ? 0 : (total_count.to_f / @form.page_size).ceil

        return broadcast(:ok, users, total_count, total_pages)
      end
    end
  end
end
