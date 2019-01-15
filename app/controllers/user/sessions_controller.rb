class User::SessionsController < Devise::SessionsController
  respond_to :json

  before_action :check_user_authenticated, only: :destroy

  # POST /login
  def create
    # Note: if we want to use more than just the :database_authenticatable
    # strategy in Devise we will have to figure out a way to call:
    # warden.authenticate!(auth_options)
    # Current we are validating login using the user.valid_password? helper
    # only, but warden.authenticate! will take care of other strategies like
    # :confirmable, :lockable, etc.

    email = params['data']['attributes']['email']
    password = params['data']['attributes']['password']
    return render json: {}, status: :unauthorized if email.blank? || password.blank?

    user = User.find_by(email: email)

    return render json: {}, status: :unauthorized unless user.present? && user.valid_password?(password)

    self.resource = user

    sign_in(resource_name, resource)

    login_model = Login.new(
      id: resource.id,
      email: resource.email,
      name: resource.name,
      token: current_jwt_token,
      role: resource.highest_role
    )
    json_api_resource = JSONAPI::ResourceSerializer.new(LoginResource).serialize_to_hash(LoginResource.new(login_model, nil))

    return render json: json_api_resource
  end

  # DELETE /logout
  def destroy
    authorization_header = request.headers['Authorization']

    Commands::Sessions::BlacklistJti.call(authorization_header) do
      on(:ok) do
        return render json: {}, status: :ok
      end

      on(:invalid) do
        return render json: {}, status: 422
      end
    end
  end

  protected

  # Override this devise method which is invoked before the 'destroy' action.
  # Since we authenticate using a JWT token in Authentication header, the
  # base devise method does not work. Instead, we already call our own method
  # 'check_user_authenticated' in a before_action filter that  checks the
  # 'current_user' devise property to see if a user is  signed in before
  # logging out.
  def verify_signed_out_user
  end

  def respond_with(resource, _opts = {})
    render json: resource
  end

  def respond_to_on_destroy
    head :no_content
  end

  def current_jwt_token
    request.env['warden-jwt_auth.token']
  end
end
