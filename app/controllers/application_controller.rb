class ApplicationController < ActionController::API
  include ActionController::MimeResponds

  respond_to :json
  protected

  def check_user_authenticated
    if current_user.nil?
      render_unauthorized
      return false
    end
  end

  def render_bad_request(message, code = '')
    render json: {
      message: message,
      code: code
    }, status: :bad_request
  end

  def render_unauthorized
    render json: {}, status: :unauthorized
  end
end
