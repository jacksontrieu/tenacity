class User::RegistrationsController < Devise::RegistrationsController
  include CanCan::ControllerAdditions

  respond_to :json

  before_action :check_user_authenticated, only: %w[index detail show update]
  before_action :configure_sign_up_params, only: [:create]
  before_action :configure_account_update_params, only: [:update]

  # GET /users
  def index
    form = Forms::Registrations::GetUsersForm.from_params(
      page_number: params[:page_number] || 1,
      page_size: params[:page_size] || 20
    )

    Commands::Registrations::GetUsers.call(form, current_user) do
      on(:ok) do |users, total_count|
        return render json: {
          users: users,
          page_number: form.page_number,
          page_size: form.page_size,
          total_count: total_count
        }, status: :ok
      end

      on(:invalid) do |reason|
        return render_bad_request(reason)
      end

      on(:not_permitted) do
        return render_unauthorized
      end
    end
  end

  # GET /users/:id
  def show
    form = Forms::Registrations::GetUserForm.from_params(params)

    Commands::Registrations::GetUser.call(form, current_user) do
      on(:ok) do |user|
        return render json: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone
        }, status: :ok
      end

      on(:invalid) do |reason|
        return render_bad_request(reason)
      end

      on(:not_permitted) do
        return render_unauthorized
      end
    end
  end

  # PATCH /users/:id
  # PUT /users/:id
  def update
    # Otherwise, for updates to specific users (/users/:id route), use this
    # custom logic.
    form = Forms::Registrations::UpdateUserForm.from_params(
      id: params[:id],
      first_name: params['user']['first_name'],
      last_name: params['user']['last_name'],
      phone: params['user']['phone']
    )

    Commands::Registrations::UpdateUser.call(form, current_user) do
      on(:ok) do
        return render json: {}, status: :ok
      end

      on(:invalid) do |reason|
        return render_bad_request(reason)
      end

      on(:not_permitted) do
        return render_unauthorized
      end
    end
  end

  protected

  def update_resource(resource, params)
    resource.update_without_password(params)
  end

  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: %w[first_name last_name phone])
  end

  def configure_account_update_params
    devise_parameter_sanitizer.permit(:account_update, keys: %w[first_name last_name phone])
  end
end
