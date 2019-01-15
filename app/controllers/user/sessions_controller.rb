class User::SessionsController < Devise::SessionsController
  respond_to :json

  before_action :check_user_authenticated, only: %w[destroy]

  # POST /login
  def create
    self.resource = warden.authenticate!(auth_options)
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)

    # Cannot use JSON:API spec on this endpoint.
    # Custom response so that we include the JSON Web Token in the API
    # response. This is required by the 'ember-simple-auth-token' library we
    # use, ideally we should extract the token from the 'Authentication'
    # response header instead.
    render json: {
      id: resource.id,
      email: resource.email,
      name: resource.name,
      token: current_jwt_token,
      role: resource.highest_role
    }
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

  private

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
