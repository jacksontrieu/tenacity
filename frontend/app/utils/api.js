import ENV from 'tenacity-client/config/environment';

export const endpoints = {
  get_user_details: function(id) {
    return `/users/${id}`
  },
  get_user_list: '/users',
  signup: '/users',
  update_password: '/password',
  update_user: function(id) {
    return `/users/${id}`
  }
};

export const buildApiUrl = (endpoint) => {
  let result = ENV['TENACITY_API_FULL_URL'];

  // Make sure that we don't accidentally have two / characters, or zero of
  // them when we join the host URL with the endpoint part.
  if (!result.endsWith('/')) {
    result += '/'
  }

  if (endpoint.startsWith('/')) {
    result += endpoint.substring(1, endpoint.length);
  }
  else {
    result += endpoint;
  }

  return result;
};
