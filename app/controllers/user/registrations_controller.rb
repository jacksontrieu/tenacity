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
      on(:ok) do |users, total_count, total_pages|
        resource_array = users.map { |user| UserResource.new(user, nil) }

        data = JSONAPI::ResourceSerializer.new(UserResource).serialize_to_hash(resource_array)
        data['meta'] = {
          totalPages: total_pages,
          totalCount: total_count
        }

        return render json: data
      end

      on(:invalid) do |errors|
        return render_active_record_errors(errors)
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
        resource = JSONAPI::ResourceSerializer.new(UserResource).serialize_to_hash(UserResource.new(user, nil))
        return render json: resource, status: :ok
      end

      on(:invalid) do |errors|
        return render_active_record_errors(errors)
      end

      on(:record_not_found) do
        return render_record_not_found
      end

      on(:not_permitted) do
        return render_unauthorized
      end
    end
  end

  # PATCH /users/:id
  # PUT /users/:id
  def update
    form = Forms::Registrations::UpdateUserForm.from_params(
      id: params['data']['id'],
      first_name: params['data']['attributes']['first-name'],
      last_name: params['data']['attributes']['last-name'],
      phone: params['data']['attributes']['phone']
    )

    Commands::Registrations::UpdateUser.call(form, current_user) do
      on(:ok) do |user|
        resource = JSONAPI::ResourceSerializer.new(UserResource).serialize_to_hash(UserResource.new(user, nil))
        return render json: resource, status: :ok
      end

      on(:invalid) do |errors|
        return render_active_record_errors(errors)
      end

      on(:record_not_found) do
        return render_record_not_found
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
