export const getAdminUserResponse = {
  id: 1,
  email: 'admin@user.com',
  first_name: 'Admin',
  last_name: 'User',
  phone: '0400 123 456'
};

export const getUsersResponse = {
  users: [
    {
      id: 1,
      email: 'admin@user.com',
      first_name: 'Admin',
      last_name: 'User',
      phone: '0400 123 456'
    },
    {
      id: 2,
      email: 'some@user.com',
      first_name: 'Some',
      last_name: 'User',
      phone: '0400 123 456'
    },
    {
      id: 3,
      email: 'another@user.com',
      first_name: 'Another',
      last_name: 'User',
      phone: '0400 123 456'
    }
  ],
  page_number: 1,
  page_size: 25
};
