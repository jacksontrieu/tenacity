class User::PasswordsController < Devise::PasswordsController
  before_action :check_user_authenticated

  # PATCH /password
  # PUT /password
  def update
    form = Forms::Passwords::UpdatePasswordForm.from_params(
      id: params['data']['id'],
      current_password: params['data']['attributes']['current-password'],
      new_password: params['data']['attributes']['new-password'],
      confirm_password: params['data']['attributes']['confirm-password']
    )

    Commands::Passwords::UpdatePassword.call(form, current_user) do
      on(:ok) do |user_id|
        password_update = PasswordUpdate.new(id: user_id)
        resource = JSONAPI::ResourceSerializer.new(PasswordUpdateResource).serialize_to_hash(PasswordUpdateResource.new(password_update, nil))

        return render json: resource
        # return render json: { success: true }, status: :ok
      end

      on(:invalid) do |reason|
        return render_bad_request(reason)
      end

      on(:not_permitted) do
        return render_unauthorized
      end
    end
  end
end
