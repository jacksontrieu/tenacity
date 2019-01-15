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

        should 'Broadcast :record_not_found if no user with id exists' do
          invalid_user_id = generate_invalid_user_id

          form = ::Forms::Registrations::GetUserForm.from_params(id: invalid_user_id)
          assert_command_result(:record_not_found, form, @requesting_user)
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
        is_record_not_found = false
        errors = nil
        is_not_permitted = false

        ::Commands::Registrations::GetUser.call(form, requesting_user) do
          on(:ok) do |returned_user|
            is_ok = true
            user = returned_user
          end

          on(:invalid) do |returned_errors|
            is_invalid = true
            errors = returned_errors
          end

          on(:record_not_found) do
            is_record_not_found = true
          end

          on(:not_permitted) { is_not_permitted = true }
        end

        if broadcasted_value == :ok
          assert is_ok
          assert_not is_invalid
          assert_not is_record_not_found
          assert errors.blank?
          assert_not is_not_permitted
          assert_not_nil user
          return user
        elsif broadcasted_value == :invalid
          assert_not is_ok
          assert is_invalid
          assert_not is_record_not_found
          assert_not errors.blank?
          assert_not is_not_permitted
          return errors
        elsif broadcasted_value == :record_not_found
          assert_not is_ok
          assert_not is_invalid
          assert is_record_not_found
          assert errors.blank?
          assert_not is_not_permitted
        elsif broadcasted_value == :not_permitted
          assert_not is_ok
          assert_not is_invalid
          assert_not is_record_not_found
          assert errors.blank?
          assert is_not_permitted
        end
      end
    end
  end
end
