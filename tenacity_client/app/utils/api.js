import ENV from 'tenacity-client/config/environment';

export const endpoints = {
  get_user_details: '/users/details',
  get_user_list: '/users',
  signup: '/users',
  update_profile: '/users',
  update_password: '/password'
};

export const buildApiUrl = (endpoint) => {
  let result = ENV['api_host_with_port'];

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
