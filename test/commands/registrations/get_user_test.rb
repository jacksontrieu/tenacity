require 'test_helper'

module Commands
  module Registrations
    class GetUserTest < ActiveSupport::TestCase
      def setup
        @requesting_user = users(:admin_user)
        @requested_user = users(:standard_user)
        @form = ::Forms::Registrations::GetUserForm.from_params(
          id: @requested_user.id
        )
      end

      context '#call' do
        should 'Broadcast :ok if valid user & requesting user has permissions' do
          assert @requesting_user.can_access_user?(@requested_user)
          user = assert_command_result(:ok, @form, @requesting_user)

          assert_equal user.id, @requested_user.id
          assert_equal user.email, @requested_user.email
          assert_equal user.first_name, @requested_user.first_name
          assert_equal user.last_name, @requested_user.last_name
          assert_equal user.phone, @requested_user.phone
        end

        should 'Broadcast :invalid if id is less than 1' do
          form = ::Forms::Registrations::GetUserForm.from_params(id: 0)
          assert_command_result(:invalid, form, @requesting_user)
        end

        should 'Broadcast :invalid if no user with id exists' do
          invalid_user_id = generate_invalid_user_id

          form = ::Forms::Registrations::GetUserForm.from_params(id: invalid_user_id)
          reason = assert_command_result(:invalid, form, @requesting_user)
          assert_equal reason, "Could not find user with id #{invalid_user_id}."
        end

        should 'Broadcast :not_permitted if user is not allowed to access user' do
          requesting_user = users(:standard_user)
          requested_user = users(:admin_user)
          assert_not requesting_user.can_access_user?(requested_user)

          form = ::Forms::Registrations::GetUserForm.from_params(id: requested_user.id)
          assert_command_result(:not_permitted, form, requesting_user)
        end
      end

      private

      def assert_command_result(broadcasted_value, form, requesting_user)
        is_ok = false
        user = nil
        is_invalid = false
        invalid_reason = nil
        is_not_permitted = false

        ::Commands::Registrations::GetUser.call(form, requesting_user) do
          on(:ok) do |returned_user|
            is_ok = true
            user = returned_user
          end

          on(:invalid) do |reason|
            is_invalid = true
            invalid_reason = reason
          end

          on(:not_permitted) { is_not_permitted = true }
        end

        if broadcasted_value == :ok
          assert is_ok
          assert_not is_invalid
          assert invalid_reason.blank?
          assert_not is_not_permitted
          assert_not_nil user
          return user
        elsif broadcasted_value == :invalid
          assert_not is_ok
          assert is_invalid
          assert_not invalid_reason.blank?
          assert_not is_not_permitted
          return invalid_reason
        elsif broadcasted_value == :not_permitted
          assert_not is_ok
          assert_not is_invalid
          assert invalid_reason.blank?
          assert is_not_permitted
        end
      end
    end
  end
end
