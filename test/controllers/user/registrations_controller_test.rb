require 'test_helper'

class User::RegistrationsControllerTest < ActionController::TestCase
  include Devise::Test::ControllerHelpers

  def setup
    request.env['devise.mapping'] = Devise.mappings[:user]

    @new_first_name = 'THIS NAME'
    @new_last_name = 'HAS CHANGED'
    @new_phone = 'THIS IS A NEW PHONE #'
  end

  #############################################################################
  # INDEX #####################################################################
  #############################################################################
  context '#index' do
    should 'Returns :ok if logged in user can manage all users and params empty' do
      logged_in_user = users(:admin_user)
      assert logged_in_user.can?(:manage, :all_users)
      sign_in(logged_in_user)

      get :index
      assert_response :ok
    end

    should 'Returns :ok if logged in user can manage all users and params provided' do
      logged_in_user = users(:admin_user)
      assert logged_in_user.can?(:manage, :all_users)
      sign_in(logged_in_user)

      params = {
        page_number: 1,
        page_size: 20
      }

      get :index, params: params
      assert_response :ok
    end

    should 'Returns 422 if page_number param invalid' do
      logged_in_user = users(:admin_user)
      assert logged_in_user.can?(:manage, :all_users)
      sign_in(logged_in_user)

      params = {
        page_number: 0,
        page_size: 20
      }

      get :index, params: params
      assert_response 422
    end

    should 'Returns 422 if page_size param invalid' do
      logged_in_user = users(:admin_user)
      assert logged_in_user.can?(:manage, :all_users)
      sign_in(logged_in_user)

      params = {
        page_number: 1,
        page_size: 0
      }

      get :index, params: params
      assert_response 422
    end

    should 'Returns :unauthorized if logged in user cannot manage all users' do
      logged_in_user = users(:standard_user)
      assert_not logged_in_user.can?(:manage, :all_users)
      sign_in(logged_in_user)

      get :index
      assert_response :unauthorized
    end

    should 'Returns :unauthorized response if not user logged in' do
      get :index
      assert_response :unauthorized
    end
  end

  #############################################################################
  # SHOW ######################################################################
  #############################################################################
  context '#show' do
    should 'Returns :ok if logged in user can access requested user' do
      logged_in_user = users(:admin_user)
      requested_user = users(:standard_user)
      assert logged_in_user.can_access_user?(requested_user)

      sign_in(logged_in_user)

      get :show, params: { id: requested_user.id }

      assert_response :ok
      assert_equal(JSON.parse(response.body)['data']['id'].to_i, requested_user.id)
    end

    should 'Returns :ok if logged in user is a standard user requesting data about themselves' do
      logged_in_user = users(:standard_user)
      requested_user = users(:standard_user)
      assert logged_in_user.can_access_user?(requested_user)

      sign_in(logged_in_user)

      get :show, params: { id: requested_user.id }

      assert_response :ok
      assert_equal(JSON.parse(response.body)['data']['id'].to_i, requested_user.id)
    end

    should 'Returns 422 if id is less than 1' do
      logged_in_user = users(:standard_user)

      sign_in(logged_in_user)

      get :show, params: { id: 0 }

      assert_response 422
    end

    should 'Returns 422 if id is not a valid user' do
      logged_in_user = users(:standard_user)
      invalid_user_id = generate_invalid_user_id

      sign_in(logged_in_user)

      get :show, params: { id: invalid_user_id }

      assert_response 422
    end

    should 'Returns :unauthorized if logged in user does not cannot access requested user' do
      logged_in_user = users(:standard_user)
      requested_user = users(:admin_user)
      assert_not logged_in_user.can_access_user?(requested_user)

      sign_in(logged_in_user)

      get :show, params: { id: requested_user.id }

      assert_response :unauthorized
    end

    should 'Returns :unauthorized if no user logged in' do
      requested_user = users(:standard_user)

      get :show, params: { id: requested_user.id }

      assert_response :unauthorized
    end
  end

  #############################################################################
  # UPDATE ####################################################################
  #############################################################################
  context '#update' do
    should 'Returns :ok if user is logged in and can update requested user' do
      logged_in_user = users(:admin_user)
      requested_user = users(:standard_user)
      assert logged_in_user.can_access_user?(requested_user)

      sign_in(logged_in_user)

      put :update, params: {
        id: requested_user.id,
        "data": {
          "id": requested_user.id.to_s,
          "attributes": {
            "first-name": @new_first_name,
            "last-name": @new_last_name,
            "phone": @new_phone
          }
        }
      }

      assert_response :ok
      assert_update_did_update(requested_user)
    end

    should 'Returns :ok if user is standard user logged in and is updating themselves' do
      logged_in_user = users(:standard_user)

      sign_in(logged_in_user)

      put :update, params: {
        id: logged_in_user.id,
        "data": {
          "id": logged_in_user.id.to_s,
          "attributes": {
            "first-name": @new_first_name,
            "last-name": @new_last_name,
            "phone": @new_phone
          }
        }
      }

      assert_response :ok
      assert_update_did_update(logged_in_user)
    end

    should 'Returns 422 if first name is invalid' do
      logged_in_user = users(:admin_user)
      requested_user = users(:standard_user)
      assert logged_in_user.can_access_user?(requested_user)

      sign_in(logged_in_user)

      put :update, params: {
        id: requested_user.id,
        "data": {
          "id": requested_user.id.to_s,
          "attributes": {
            "first-name": 'c' * 151,
            "last-name": @new_last_name,
            "phone": @new_phone
          }
        }
      }

      assert_response 422
      assert_update_did_not_update(requested_user)
    end

    should 'Returns 422 if requested user id does not exist' do
      logged_in_user = users(:admin_user)

      sign_in(logged_in_user)

      put :update, params: {
        id: generate_invalid_user_id,
        "data": {
          "id": generate_invalid_user_id.to_s,
          "attributes": {
            "first-name": @new_first_name,
            "last-name": @new_last_name,
            "phone": @new_phone
          }
        }
      }

      assert_response 422
    end

    should 'Returns :unauthorized if user is logged in but is not permitted to update requested user' do
      logged_in_user = users(:standard_user)
      requested_user = users(:admin_user)
      assert_not logged_in_user.can_access_user?(requested_user)

      sign_in(logged_in_user)

      put :update, params: {
        id: requested_user.id,
        "data": {
          "id": requested_user.id.to_s,
          "attributes": {
            "first-name": @new_first_name,
            "last-name": @new_last_name,
            "phone": @new_phone
          }
        }
      }

      assert_response :unauthorized
      assert_update_did_not_update(requested_user)
    end

    should 'Returns :unauthorized if no user logged in' do
      requested_user = users(:admin_user)

      put :update, params: {
        id: requested_user.id,
        "data": {
          "id": requested_user.id.to_s,
          "attributes": {
            "first-name": @new_first_name,
            "last-name": @new_last_name,
            "phone": @new_phone
          }
        }
      }

      assert_response :unauthorized
      assert_update_did_not_update(requested_user)
    end
  end

  private

  def assert_show_body_valid(response_body, requested_user)
      payload = JSON.parse(response_body)
      assert_equal requested_user.id, payload['id']
      assert_equal requested_user.email, payload['email']
      assert_equal requested_user.first_name, payload['first_name']
      assert_equal requested_user.last_name, payload['last_name']
      assert_equal requested_user.phone, payload['phone']
  end

  def assert_update_did_update(requested_user)
    user_after_update = User.find(requested_user.id)
    assert_equal @new_first_name, user_after_update.first_name
    assert_equal @new_last_name, user_after_update.last_name
    assert_equal @new_phone, user_after_update.phone
  end

  def assert_update_did_not_update(requested_user)
    user_after_update = User.find(requested_user.id)
    assert_not_equal @new_first_name, user_after_update.first_name
    assert_not_equal @new_last_name, user_after_update.last_name
    assert_not_equal @new_phone, user_after_update.phone
  end
end
