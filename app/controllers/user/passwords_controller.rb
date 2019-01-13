class User::PasswordsController < Devise::PasswordsController
  # PATCH /password
  # PUT /password
  def update
    form = Forms::Passwords::UpdatePasswordForm.from_params(params)

    Commands::Passwords::UpdatePassword.call(form, current_user) do
      on(:ok) do
        return render json: { success: true }, status: :ok
      end

      on(:invalid) do |reason|
        return render_bad_request(reason)
      end
    end
  end
end
