module JsonApiResponseHelper
  def json_apify_ar_errors(errors)
    response_errors = []

    errors.each do |key, value|
      response_errors.push(
        status: '422',
        source: { 'pointer': "data/attributes/#{key}"},
        title: 'Invalid Attribute',
        detail: "#{value}"
      )
    end

    return {
      errors: response_errors
    }
  end
end
