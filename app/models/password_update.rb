class PasswordUpdate
  attr_accessor :id

  def initialize(params = {})
    @id = params[:id]
  end
end
