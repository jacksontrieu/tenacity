class ApplicationController < ActionController::API
  include ActionController::MimeResponds

  alias devise_current_user :current_user

  respond_to :json

  def render_resource(resource)
    if resource.errors.empty?
      render json: resource
    else
      validation_error(resource)
    end
  end

  def validation_error(resource)
    render json: {
      errors: [
        {
          status: '400',
          title: 'Bad Request',
          detail: resource.errors,
          code: '100'
        }
      ]
    }, status: :bad_request
  end

  def current_user
    return devise_current_user
  end

  protected

  def check_user_authenticated
    if current_user.nil?
      render json: {}, status: :unauthorized
      return false
    end
  end
end
