import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject } from '@ember/service';
import { constants } from '../utils/constants';

const calculateAbilities = (role, router) => {
  let result = [];

  result.push({
    displayText: 'Edit your profile',
    url: router.generate('dashboard')
  });

  if (role == constants.roles.admin_user) {
    result.push({
      displayText: 'Manage all users',
      url: router.generate('dashboard')
    });
  }

  return result;
};

export default Route.extend(AuthenticatedRouteMixin, {
  session: inject('session'),

  setupController(controller, model) {
    this._super(controller, model);

    // Hide the navigation menu since this is an unauthenticated route.
    this.controllerFor('application').set('showNavigation', true);
  },
  model() {
    let result = {};

    // ember-simple-auth-token stores authorization info in a session service.
    const authInfo = this.get('session').data;
    result['name'] = authInfo.authenticated.name;
    result['role'] = authInfo.authenticated.role;

    // Calculate the things this user is allowed to do based on their role.
    result['abilities'] = calculateAbilities(
      authInfo.authenticated.role,
      this._router
    );

    return result;
  }
});
