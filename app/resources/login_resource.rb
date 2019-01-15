class LoginResource < JSONAPI::Resource
  attributes :id, :email, :name, :token, :role
end
