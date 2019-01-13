require 'test_helper'

module Commands
  module Passwords
    class UpdatePasswordTest < ActiveSupport::TestCase
      def setup
        @user = users(:admin_user)
        @form = ::Forms::Passwords::UpdatePasswordForm.from_params(
          current_password: 'testing123$',
          new_password: 'another123$',
          confirm_password: 'another123$'
        )
      end

      context '#call' do
        should 'Broadcast :ok if passwords valid' do
          assert_command_result(:ok, @form, @user)
        end

        should 'Broadcast :invalid if current password not valid' do
          form = ::Forms::Passwords::UpdatePasswordForm.from_params(
            current_password: '__WRONG_PASSWORD__',
            new_password: 'another123$',
            confirm_password: 'another123$'
          )

          reason = assert_command_result(:invalid, form, @user)
          assert_equal 'The current password was not valid, please try again.', reason
        end

        should "Broadcast :invalid if new password doesn't match" do
          form = ::Forms::Passwords::UpdatePasswordForm.from_params(
            current_password: 'testing123$',
            new_password: 'another123$',
            confirm_password: '__NOT_MATCHING__'
          )

          reason = assert_command_result(:invalid, form, @user)
          assert_equal "The new password doesn't match.", reason
        end

        should 'Broadcast :invalid if new passwords blank' do
          form = ::Forms::Passwords::UpdatePasswordForm.from_params(
            current_password: '__WRONG_PASSWORD__',
            new_password: '',
            confirm_password: ''
          )

          reason = assert_command_result(:invalid, form, @user)
          assert reason.include?("New password can't be blank")
        end
      end

      def assert_command_result(broadcasted_value, form, user)
        is_ok = false
        is_invalid = false
        invalid_reason = nil

        ::Commands::Passwords::UpdatePassword.call(form, user) do
          on(:ok) { is_ok = true}

          on(:invalid) do |reason|
            is_invalid = true
            invalid_reason = reason
          end
        end

        if broadcasted_value == :ok
          assert is_ok
          assert_not is_invalid
          assert invalid_reason.blank?
          return
        elsif broadcasted_value == :invalid
          assert_not is_ok
          assert is_invalid
          assert_not invalid_reason.blank?
          return invalid_reason
        end
      end
    end
  end
end
