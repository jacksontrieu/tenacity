module JsonApiResponseHelper
  def json_apify_ar_errors(errors)
    response_errors = []

    errors.each do |key, value|
      if value.kind_of?(Array)
        value.each do |error_string|
          response_errors.push(create_error(key, error_string))
        end
      else
        response_errors.push(create_error(key, value))
      end
    end

    return {
      errors: response_errors
    }
  end

  def create_error(key, error_string)
    return {
      status: '422',
      source: { 'pointer': "data/attributes/#{key}"},
      title: 'Invalid Attribute',
      detail: "#{error_string}"
    }
  end
end
