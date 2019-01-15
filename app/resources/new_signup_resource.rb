class NewSignupResource < JSONAPI::Resource
  attributes :email, :first_name, :last_name, :phone
end
