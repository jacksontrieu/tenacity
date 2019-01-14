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
    return this.store.query('user', {
      page_number: params.pageNumber,
      page_size: params.pageSize
    });
  },

  afterModel(model) {
    showWaitCursor(false);
    this.controllerFor('users/index').set('isLoading', false);
    this.controllerFor('users/index').set('totalCount', model.meta.totalCount);
  }
});
