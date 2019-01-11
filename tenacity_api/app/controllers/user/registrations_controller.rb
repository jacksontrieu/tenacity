class User::RegistrationsController < Devise::RegistrationsController
  include CanCan::ControllerAdditions

  respond_to :json

  before_action :check_user_authenticated, only: [:index]
  before_action :configure_sign_up_params, only: [:create]
  before_action :configure_account_update_params, only: [:update]

  def index
    return render_unauthorized unless can? :manage, :all_users

    query = ::Queries::Users::All.new

    users = query.data.select(:id, :email, :first_name, :last_name, :phone)

    render json: {
      users: users,
      page_number: query.page_number,
      page_size: query.page_size
    }, status: :ok
  end


#https://github.com/plataformatec/devise/wiki/How-To:-Allow-users-to-edit-their-account-without-providing-a-password



  # GET /resource/sign_up
  # def new
  #   super
  # end

  # POST /resource
  # def create
  #   super
  # end

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  protected

  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: %w[first_name last_name phone])
  end

  def configure_account_update_params
    devise_parameter_sanitizer.permit(:account_update, keys: %w[first_name last_name phone])
  end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end
end
