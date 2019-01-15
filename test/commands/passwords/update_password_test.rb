require 'test_helper'

module Commands
  module Passwords
    class UpdatePasswordTest < ActiveSupport::TestCase
      def setup
        @user = users(:admin_user)
        @form = ::Forms::Passwords::UpdatePasswordForm.from_params(
          id: @user.id,
          current_password: 'testing123$',
          new_password: 'another123$$$',
          confirm_password: 'another123$$$'
        )
      end

      context '#call' do
        # should 'Broadcast :ok if passwords valid' do
        #   assert_command_result(:ok, @form, @user)
        # end

        should 'Broadcast :invalid if current password not valid' do
          form = ::Forms::Passwords::UpdatePasswordForm.from_params(
            id: @user.id,
            current_password: '__WRONG_PASSWORD__',
            new_password: 'another123$$$',
            confirm_password: 'another123$$$'
          )

          errors = assert_command_result(:invalid, form, @user)
          assert_equal 'is not valid, please try again', errors[:current_password]
        end

        should "Broadcast :invalid if new password doesn't match" do
          form = ::Forms::Passwords::UpdatePasswordForm.from_params(
            id: @user.id,
            current_password: 'testing123$',
            new_password: 'another123$$$',
            confirm_password: '__NOT_MATCHING__'
          )

          errors = assert_command_result(:invalid, form, @user)
          assert_equal "doesn't match confirm password", errors[:new_password]
        end

        should 'Broadcast :invalid if new password is weak' do
          form = ::Forms::Passwords::UpdatePasswordForm.from_params(
            id: @user.id,
            current_password: 'testing123$',
            new_password: 'weak',
            confirm_password: 'weak'
          )

          errors = assert_command_result(:invalid, form, @user)
          assert errors[:new_password].include?('Complexity requirement not met. Length should be 8-70 characters and include: 1 lowercase, 1 digit and 1 special character')
        end

        should 'Broadcast :invalid if new passwords blank' do
          form = ::Forms::Passwords::UpdatePasswordForm.from_params(
            id: @user.id,
            current_password: '__WRONG_PASSWORD__',
            new_password: '',
            confirm_password: ''
          )

          errors = assert_command_result(:invalid, form, @user)
          assert errors[:new_password].include?("can't be blank")
        end
      end

      def assert_command_result(broadcasted_value, form, user)
        is_ok = false
        is_invalid = false
        errors = nil

        ::Commands::Passwords::UpdatePassword.call(form, user) do
          on(:ok) { is_ok = true}

          on(:invalid) do |returned_errors|
            is_invalid = true
            errors = returned_errors
          end
        end

        if broadcasted_value == :ok
          assert is_ok
          assert_not is_invalid
          assert errors.blank?
          return
        elsif broadcasted_value == :invalid
          assert_not is_ok
          assert is_invalid
          assert_not errors.blank?
          return errors
        end
      end
    end
  end
end
