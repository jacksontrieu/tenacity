import { constants } from './constants';

export const checkUserIsAdmin = (authInfo) => {
  return authInfo &&
         authInfo.authenticated &&
         authInfo.authenticated.role == constants.roles.admin_user;
};
