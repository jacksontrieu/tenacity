require 'test_helper'

module Commands
  module Registrations
    class GetUsersTest < ActiveSupport::TestCase
      require 'faker'

      def setup
        @requesting_user = users(:admin_user)
        @form = ::Forms::Registrations::GetUsersForm.from_params(
          page_number: 1,
          page_size: 500
        )
      end

      context '#call' do
        should 'Broadcast :ok if requesting user has permission to manage all users' do
          assert @requesting_user.can?(:manage, :all_users)

          result_hash = assert_command_result(:ok, @form, @requesting_user)
          users = result_hash[:users]
          total_count = result_hash[:total_count]

          assert_equal users.count, User.all.count
          assert_equal total_count, User.all.count
        end

        should 'Does not return more than page size' do
          create_fake_users(10)
          assert_operator User.all.count, :>, 10

          requested_page_size = 10

          form = ::Forms::Registrations::GetUsersForm.from_params(
            page_number: 1,
            page_size: requested_page_size
          )

          result_hash = assert_command_result(:ok, form, @requesting_user)
          users = result_hash[:users]
          total_count = result_hash[:total_count]

          assert_equal users.count, requested_page_size
          assert_equal total_count, User.all.count
        end

        should 'Broadcast :invalid if page number smaller than 1' do
          form = ::Forms::Registrations::GetUsersForm.from_params(
            page_number: 0,
            page_size: 500
          )
          assert_command_result(:invalid, form, @requesting_user)
        end

        should 'Broadcast :invalid if page size smaller than 1' do
          form = ::Forms::Registrations::GetUsersForm.from_params(
            page_number: 1,
            page_size: 0
          )
          assert_command_result(:invalid, form, @requesting_user)
        end

        should 'Broadcast :not_permitted if requesting user does not have permission to manage all users' do
          requesting_user = users(:standard_user)
          assert_not requesting_user.can?(:manage, :all_users)

          assert_command_result(:not_permitted, @form, requesting_user)
        end
      end

      private

      def assert_command_result(broadcasted_value, form, requesting_user)
        is_ok = false
        users = nil
        total_count = nil
        is_invalid = false
        invalid_reason = nil
        is_not_permitted = false

        ::Commands::Registrations::GetUsers.call(form, requesting_user) do
          on(:ok) do |returned_users, returned_total_count|
            is_ok = true
            users = returned_users
            total_count = returned_total_count
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
          assert_not_nil users
          assert_not_nil total_count
          return { users: users, total_count: total_count }
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
