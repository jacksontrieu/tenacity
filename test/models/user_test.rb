require 'test_helper'

class UserTest < ActiveSupport::TestCase
  context '#can_access_user?' do
    should 'Admin user can access other admin user' do
      user = users(:admin_user)
      requested_user = users(:admin_two_user)

      assert user.can_access_user?(requested_user)
    end

    should 'Admin user can access standard user' do
      user = users(:admin_user)
      requested_user = users(:standard_user)

      assert user.can_access_user?(requested_user)
    end

    should 'Admin user can access themselves' do
      user = users(:admin_user)
      requested_user = users(:admin_user)

      assert user.can_access_user?(requested_user)
    end

    should 'Standard user cannot access other admin user' do
      user = users(:standard_user)
      requested_user = users(:admin_two_user)

      assert_not user.can_access_user?(requested_user)
    end

    should 'Standard user cannot access another standard user' do
      user = users(:standard_user)
      requested_user = users(:standard_two_user)

      assert_not user.can_access_user?(requested_user)
    end

    should 'Standard user can access themselves' do
      user = users(:standard_user)
      requested_user = users(:standard_user)

      assert user.can_access_user?(requested_user)
    end
  end

  context '#name' do
    should 'Returns concatenated name if both first name and last name exist' do
      user = User.new(first_name: 'Joe', last_name: 'Bloggs')
      assert_equal 'Joe Bloggs', user.name
    end

    should 'Returns first name only if only first name exists' do
      user = User.new(first_name: 'Joe')
      assert_equal 'Joe', user.name
    end

    should 'Returns last name only if only last name exists' do
      user = User.new(last_name: 'Bloggs')
      assert_equal 'Bloggs', user.name
    end

    should 'Strips out space preceding & trailing space characters when extraneous space characters exist' do
      user = User.new(first_name: '  Joe  ', last_name: '  Bloggs  ')
      assert_equal 'Joe Bloggs', user.name
    end
  end

  context '#highest_role' do
    should "Return user's only role if they have only one role" do
      assert_equal :admin_user, users(:admin_user).highest_role
      assert_equal :standard_user, users(:standard_user).highest_role
    end

    should 'Return admin_user role if user has both admin & standard roles' do
      new_user = User.new(
        email: 'new_user@gmail.com',
        first_name: 'New',
        last_name: 'User',
        phone: '0412 345 678'
      )
      new_user.password = 'testing123$'
      new_user.password_confirmation = 'testing123$'
      new_user.save!
      new_user.add_role(:standard_user)
      new_user.add_role(:admin_user)

      assert new_user.has_role?(:admin_user)
      assert_equal :admin_user, new_user.highest_role
    end
  end

  context 'New users' do
    should 'Automatically be assigned the standard_user role' do
      new_user = User.new(
        email: 'new_user@gmail.com',
        first_name: 'New',
        last_name: 'User',
        phone: '0412 345 678'
      )
      new_user.password = 'testing123$'
      new_user.password_confirmation = 'testing123$'
      new_user.save!

      assert new_user.has_role?(:standard_user)
      assert_not new_user.has_role?(:admin_user)
    end
  end
end
