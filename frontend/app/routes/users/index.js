import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import NavigationRouteMixin from '../../mixins/navigation-route-mixin';
import AdminRestrictedRouteMixin from '../../mixins/admin-restricted-route-mixin';
import { inject } from '@ember/service';
import { buildApiUrl, endpoints } from '../../utils/api';

export default Route.extend(AuthenticatedRouteMixin, AdminRestrictedRouteMixin, NavigationRouteMixin, {
  ajax: inject(),

  model() {
    return this.get('ajax').request(buildApiUrl(endpoints.get_user_list));
  }
});