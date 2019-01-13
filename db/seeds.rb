require 'faker'

def create_users
  jackson = User.new(
    email: 'jackson.trieu@gmail.com',
    first_name: 'Jackson',
    last_name: 'Trieu',
    phone: '0412 345 678'
  )
  jackson.password = 'testing123$$'
  jackson.password_confirmation = 'testing123$$'
  jackson.save!
  jackson.remove_role(:standard_user)
  jackson.add_role(:admin_user)

  standard = User.new(
    email: 'standard@user.com',
    first_name: 'Standard',
    last_name: 'User',
    phone: '0498 765 432'
  )
  standard.password = 'testing123$$'
  standard.password_confirmation = 'testing123$$'
  standard.save!
end

def create_fake_users
  50.times do
    user = User.new(
      email: Faker::Internet.email,
      first_name: Faker::Name.name,
      last_name: Faker::Name.last_name,
      phone: Faker::PhoneNumber.phone_number
    )

    user.password = 'testing123$$'
    user.password_confirmation = 'testing123$$'
    user.save!
  end
end

create_users
create_fake_users
