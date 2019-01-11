import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Route.extend(UnauthenticatedRouteMixin, {
  setupController(controller, model) {
    this._super(controller, model);

    // Hide the navigation menu since this is an unauthenticated route.
    this.controllerFor('application').set('showNavigation', false);
  }
});
