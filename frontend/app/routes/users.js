import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import NavigationRouteMixin from '../mixins/navigation-route-mixin';
import AdminRestrictedRouteMixin from '../mixins/admin-restricted-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, AdminRestrictedRouteMixin, NavigationRouteMixin, {
});
