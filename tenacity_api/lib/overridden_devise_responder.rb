module OverriddenDeviseResponder
  protected

  def json_resource_errors
    {
      success: false,
      errors: ApplicationErrorFormatter.call(resource.errors)
    }
  end
end
