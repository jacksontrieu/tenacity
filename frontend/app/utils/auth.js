import { constants } from './constants';

export const checkUserIsAdmin = (authInfo) => {
  return authInfo &&
         authInfo.authenticated &&
         authInfo.authenticated.role == constants.roles.admin_user;
};

export const createLoginPostBody = (email, password) => {
  return {
    "data": {
      "id": null,
      "type": "login",
      "links": {
        "self": "/login"
      },
      "attributes": {
        "email": email,
        "password": password
      }
    }
  };
};
