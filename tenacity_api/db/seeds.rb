def create_users
  jackson = User.new(
    email: 'jackson.trieu@gmail.com',
    first_name: 'Jackson',
    last_name: 'Trieu',
    phone: '0412 345 678'
  )
  jackson.password = 'testing123$'
  jackson.password_confirmation = 'testing123$'
  jackson.save!
  jackson.remove_role(:standard_user)
  jackson.add_role(:admin_user)

  standard = User.new(
    email: 'standard@user.com',
    first_name: 'Standard',
    last_name: 'User',
    phone: '0498 765 432'
  )
  standard.password = 'testing123$'
  standard.password_confirmation = 'testing123$'
  standard.save!
end

create_users
