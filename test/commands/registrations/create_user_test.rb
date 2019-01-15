require 'test_helper'

module Commands
  module Registrations
    class CreateUserTest < ActiveSupport::TestCase
      def setup
        @email = 'test.fixture@test.com'
        @first_name = 'Test'
        @last_name = 'Fixture'
        @phone = '0400 456 123'
        @password = 'testing123$'
      end

      context '#call' do
        should 'Broadcast :ok if valid form' do
          form = ::Forms::Registrations::CreateUserForm.from_params(
            email: @email,
            first_name: @first_name,
            last_name: @last_name,
            phone: @phone,
            password: @password
          )

          is_ok = false
          is_invalid = false
          user = nil
          errors = nil
          ::Commands::Registrations::CreateUser.call(form) do
            on(:ok) do |return_user|
              is_ok = true
              user = return_user
            end

            on(:invalid) do |returned_errors|
              is_invalid = true
              errors = returned_errors
            end
          end

          assert is_ok
          assert_not is_invalid
          assert_not_nil user
          assert_nil errors

          assert_equal @email, user.email
          assert_equal @first_name, user.first_name
          assert_equal @last_name, user.last_name
          assert_equal @phone, user.phone

          assert user.valid_password?(@password)
        end

        should 'Broadcast :invalid if form is invalid' do
          form = ::Forms::Registrations::CreateUserForm.from_params(
            email: '',
            first_name: @first_name,
            last_name: @last_name,
            phone: @phone,
            password: @password
          )

          is_ok = false
          is_invalid = false
          user = nil
          errors = nil
          ::Commands::Registrations::CreateUser.call(form) do
            on(:ok) do |return_user|
              is_ok = true
              user = return_user
            end

            on(:invalid) do |returned_errors|
              is_invalid = true
              errors = returned_errors
            end
          end

          assert_not is_ok
          assert is_invalid
          assert_nil user
          assert_not_nil errors

          assert_not_nil errors[:email]
          assert errors[:email].include?("can't be blank")
        end
      end
    end
  end
end
