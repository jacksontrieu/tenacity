class User::SessionsController < Devise::SessionsController
  respond_to :json

  # POST /resource/sign_in
  def create
    self.resource = warden.authenticate!(auth_options)
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)

    # Custom response so that we include the JSON Web Token in the API
    # response. This is required by the 'ember-simple-auth-token' library we
    # use, ideally we should extract the token from the 'Authentication'
    # response header instead.
    render json: {
      id: resource.id,
      email: resource.email,
      token: current_token
    }
  end

  private

  def respond_with(resource, _opts = {})
    render json: resource
  end

  def respond_to_on_destroy
    head :no_content
  end

  def current_token
    request.env['warden-jwt_auth.token']
  end
end
