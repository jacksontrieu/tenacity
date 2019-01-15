ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require 'minitest/unit'
require 'mocha/minitest'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all
  fixtures :users, :roles, :users_roles

  def random_id
    r = Random.new
    return r.rand(1..(1 << 16))
  end

  def generate_invalid_user_id
    current = random_id

    until User.find_by(id: current).nil?
      current = random_id
    end

    return current
  end

  # def login_to_app(email = 'jackson.trieu@gmail.com', password = 'testing123$')
  #   sign_in user

  #   # Save the current controller
  #   old_controller = @controller

  #   # Use the API Authentication controller
  #   @controller = ApiAuthenticationController.new
  #   request.env['devise.mapping'] = Devise.mappings[:user]

  #   post :login, format: 'json', email: email, password: password
  #   # Restore the original controller
  #   @controller = old_controller

  #   result = JSON.parse(response.body)

  #   @session_user_id = result['id']
  #   @session_user_email = result['email']
  #   @session_user_email = result['email']
  #   @session_user_token = result['token']
  #   @session_user_role = result['role']

  #   return result
  # end
end
