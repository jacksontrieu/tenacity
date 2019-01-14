import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import NavigationRouteMixin from '../../mixins/navigation-route-mixin';
import AdminRestrictedRouteMixin from '../../mixins/admin-restricted-route-mixin';
import { inject } from '@ember/service';
import { buildApiUrl, endpoints } from '../../utils/api';
import { showWaitCursor } from '../../utils/ui';

export default Route.extend(AdminRestrictedRouteMixin, AuthenticatedRouteMixin, NavigationRouteMixin, {
  ajax: inject(),
  queryParams: {
    pageNumber: {
      refreshModel: true
    },
    pageSize: {
      refreshModel: true
    }
  },

  beforeModel() {
    showWaitCursor(true);
    this.controllerFor('users/index').set('isLoading', true);
  },

  model(params) {
    return this.get('ajax').request(buildApiUrl(endpoints.get_user_list(
      params.pageNumber,
      params.pageSize
    )));
  },

  afterModel(model) {
    showWaitCursor(false);
    this.controllerFor('users/index').set('isLoading', false);
    this.controllerFor('users/index').set('pageNumber', model.page_number);
    this.controllerFor('users/index').set('pageSize', model.page_size);
    this.controllerFor('users/index').set('totalCount', model.total_count);
  }
});
