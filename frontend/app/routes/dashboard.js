import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import NavigationRouteMixin from '../mixins/navigation-route-mixin';
import { inject } from '@ember/service';
import { checkUserIsAdmin } from '../utils/auth';

const calculateAbilities = (authInfo, router) => {
  let result = [];

  const isUserAdmin = checkUserIsAdmin(authInfo);

  result.push({
    displayText: 'Edit your profile',
    url: router.generate('profile'),
    className: 'ability-edit-profile'
  });

  result.push({
    displayText: 'Change your password',
    url: router.generate('change-password'),
    className: 'ability-change-password'
  });

  if (isUserAdmin) {
    result.push({
      displayText: 'Manage all users',
      url: router.generate('users'),
      className: 'ability-manage-all-users'
    });
  }

  return result;
};

export default Route.extend(AuthenticatedRouteMixin, NavigationRouteMixin,  {
  session: inject('session'),

  model() {
    let result = {};

    // ember-simple-auth-token stores authorization info in a session service.
    const authInfo = this.get('session').data;
    result['name'] = authInfo.authenticated.name;
    result['role'] = authInfo.authenticated.role;

    // Calculate the things this user is allowed to do based on their role.
    result['abilities'] = calculateAbilities(
      authInfo,
      this._router
    );

    return result;
  }
});
