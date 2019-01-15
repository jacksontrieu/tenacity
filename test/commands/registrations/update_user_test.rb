require 'test_helper'

module Commands
  module Registrations
    class UpdateUserTest < ActiveSupport::TestCase
      require 'faker'

      def setup
        @requesting_user = users(:admin_user)
        @user_to_update = users(:standard_user)
      end

      context '#call' do
        should 'Broadcast :ok if requesting user has permission to update the user' do
          assert @requesting_user.can_access_user?(@user_to_update)

          new_first_name = 'THIS PERSON'
          new_last_name = 'GOT UPDATED'
          new_phone = 'NEW PHONE #'

          form = ::Forms::Registrations::UpdateUserForm.from_params(
            id: @user_to_update.id,
            first_name: new_first_name,
            last_name: new_last_name,
            phone: new_phone
          )

          assert_command_result(:ok, form, @requesting_user)

          user_after_command = User.find_by(id: @user_to_update)
          assert_equal new_first_name, user_after_command.first_name
          assert_equal new_last_name, user_after_command.last_name
          assert_equal new_phone, user_after_command.phone
        end

        should 'Broadcast :invalid if form is not valid' do
          form = ::Forms::Registrations::UpdateUserForm.from_params(
            id: @user_to_update.id,
            first_name: "a" * 151,
            last_name: @user_to_update.last_name,
            phone: @user_to_update.phone
          )
          assert_not form.valid?

          assert_command_result(:invalid, form, @requesting_user)
        end

        should 'Broadcast :record_not_found if user does not exist' do
          invalid_user_id = generate_invalid_user_id

          form = ::Forms::Registrations::UpdateUserForm.from_params(
            id: invalid_user_id,
            first_name: @user_to_update.first_name,
            last_name: @user_to_update.last_name,
            phone: @user_to_update.phone
          )

          assert_command_result(:record_not_found, form, @requesting_user)
        end

        should 'Broadcast :not_permitted if requesting user does not have permission to update user' do
          requesting_user = users(:standard_user)
          unaccessible_user = users(:admin_user)
          assert_not requesting_user.can_access_user?(unaccessible_user)

          form = ::Forms::Registrations::UpdateUserForm.from_params(
            id: unaccessible_user.id,
            first_name: unaccessible_user.first_name,
            last_name: unaccessible_user.last_name,
            phone: unaccessible_user.phone
          )

          assert_command_result(:not_permitted, form, requesting_user)
        end
      end

      private

      def assert_command_result(broadcasted_value, form, requesting_user)
        is_ok = false
        is_invalid = false
        errors = nil
        is_record_not_found = false
        is_not_permitted = false

        ::Commands::Registrations::UpdateUser.call(form, requesting_user) do
          on(:ok) do
            is_ok = true
          end

          on(:invalid) do |returned_errors|
            is_invalid = true
            errors = returned_errors
          end

          on(:record_not_found) { is_record_not_found = true }

          on(:not_permitted) { is_not_permitted = true }
        end

        if broadcasted_value == :ok
          assert is_ok
          assert_not is_invalid
          assert errors.blank?
          assert_not is_record_not_found
          assert_not is_not_permitted
        elsif broadcasted_value == :invalid
          assert_not is_ok
          assert is_invalid
          assert_not errors.blank?
          assert_not is_record_not_found
          assert_not is_not_permitted
          return errors
        elsif broadcasted_value == :record_not_found
          assert_not is_ok
          assert_not is_invalid
          assert errors.blank?
          assert is_record_not_found
          assert_not is_not_permitted
        elsif broadcasted_value == :not_permitted
          assert_not is_ok
          assert_not is_invalid
          assert errors.blank?
          assert_not is_record_not_found
          assert is_not_permitted
        end
      end


      def create_fake_users(number_of_users)
        number_of_users.times do
          user = User.new(
            email: Faker::Internet.email,
            first_name: Faker::Name.name,
            last_name: Faker::Name.last_name,
            phone: Faker::PhoneNumber.phone_number
          )

          user.password = 'testing123$'
          user.password_confirmation = 'testing123$'
          user.save!
        end
      end
    end
  end
end
