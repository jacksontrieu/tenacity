class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  include JsonApiResponseHelper

  respond_to :json
  protected

  def check_user_authenticated
    if current_user.nil?
      render_unauthorized
      return false
    end
  end

  def render_active_record_errors(errors)
    render json: json_apify_ar_errors(errors), status: 422
  end

  def render_record_not_found
    render json: {}, status: 422
  end

  def render_unauthorized
    render json: {}, status: :unauthorized
  end
end
