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
end

create_users
