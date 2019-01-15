class Login
  attr_accessor :id
  attr_accessor :email
  attr_accessor :name
  attr_accessor :token
  attr_accessor :role

  def initialize(params = {})
    @id = params[:id]
    @email = params[:email]
    @name = params[:name]
    @token = params[:token]
    @role = params[:role]
  end
end
