# frozen_string_literal: true

class User::PasswordsController < Devise::PasswordsController
  # before_action :check_user_authenticated
  # GET /resource/password/new
  # def new
  #   super
  # end

  # POST /resource/password
  # def create
  #   super
  # end

  # GET /resource/password/edit?reset_password_token=abcdef
  # def edit
  #   super
  # end

  # PUT /resource/password
  def update
    unless current_user.valid_password?(params[:current_password])
      return render json: {
        success: false,
        error: 'The current password was not valid, please try again.'
      }, status: :bad_request
    end

    unless params[:new_password] == params[:confirm_password]
      return render json: {
        success: false,
        error: "The new password doesn't match."
      }, status: :bad_request
    end

    current_user.password = params[:new_password]

    unless current_user.valid?
      return render json: {
        success: false,
        error: current_user.errors.full_messages
      }, status: :ok
    end

    current_user.save

    render json: { success: true }, status: :ok
  end

  # protected

  # def after_resetting_password_path_for(resource)
  #   super(resource)
  # end

  # The path used after sending reset password instructions
  # def after_sending_reset_password_instructions_path_for(resource_name)
  #   super(resource_name)
  # end
end
