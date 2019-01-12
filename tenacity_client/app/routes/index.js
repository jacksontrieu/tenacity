import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import NoNavigationRouteMixin from '../mixins/no-navigation-route-mixin';

export default Route.extend(UnauthenticatedRouteMixin, NoNavigationRouteMixin, {
  classNames: ['root-index']
});
