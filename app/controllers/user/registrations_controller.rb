class User::RegistrationsController < Devise::RegistrationsController
  include CanCan::ControllerAdditions

  respond_to :json

  before_action :check_user_authenticated, only: %w[index detail]
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

  def show
    user = User.find(params[:id])

    return render_unauthorized unless can_access_user?(current_user, user)

    return render json: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone
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
  def update
    if params[:id].blank?
      super
    else
      user = User.find(params[:id])
      user.first_name = params['user']['first_name']
      user.last_name = params['user']['last_name']
      user.phone = params['user']['phone']
      user.save
      render json: {}, status: :ok
    end
  end

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

  # Modify the devise update user action to update a user's details without
  # requiring a password. For password changes, we have created a separate
  # password controller & page.
  # https://github.com/plataformatec/devise/wiki/How-To:-Allow-users-to-edit-their-account-without-providing-a-password
  def update_resource(resource, params)
    resource.update_without_password(params)
  end

  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: %w[first_name last_name phone])
  end

  def configure_account_update_params
    devise_parameter_sanitizer.permit(:account_update, keys: %w[first_name last_name phone])
  end

  private

  def can_access_user?(requesting_user, requested_user)
    return requesting_user.id == requested_user.id ||
           requesting_user.has_role?(:admin_user)
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
