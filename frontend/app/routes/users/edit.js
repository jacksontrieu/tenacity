import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import NavigationRouteMixin from '../../mixins/navigation-route-mixin';
import { inject } from '@ember/service';
import { showWaitCursor } from '../../utils/ui';
import { buildApiUrl, endpoints } from '../../utils/api';

export default Route.extend(AuthenticatedRouteMixin, NavigationRouteMixin, {
  ajax: inject(),

  model: function() {
   let { id } = this.paramsFor(this.routeName);
    return this.store.findRecord('user', id);
    // return this.get('ajax').request(buildApiUrl(endpoints.get_user_details(id)));
  },
  actions: {
    save: function() {
      const { id } = this.paramsFor(this.routeName);
      const model = this.controller.get('model');
      const {
        first_name,
        last_name,
        phone
      } = model;

      const data = {
        user: {
          first_name: first_name,
          last_name: last_name,
          phone: phone
        }
      };

      showWaitCursor(true);
      this.controller.set('isSaving', true);

      this.get('ajax').request(buildApiUrl(endpoints.update_user(id)), {
        contentType: 'application/json',
        method: 'PUT',
        data: data
      }).then(() => {
        this.controller.set('isSaving', false);

        // ember-simple-auth-token stores authorization info in a
        // session service, backed by the Browser's local storage. We need to
        // manually update the name set in this auth info as it may have
        // changed if the user we are updating is the current logged in user.
        const authInfo = this.get('session').data;

        if (id == authInfo.authenticated.id) {
          const newAuthInfo = {
            ...authInfo,
            authenticated: {
              ...authInfo.authenticated,
              name: (data.user.first_name + ' ' + data.user.last_name).trim()
            }
          }
          this.set('session.data', newAuthInfo);
        }

        showWaitCursor(false);
        this.transitionTo('users');
        this.toast.success('User was updated successfully');
      }).catch(() => {
        showWaitCursor(false);
        this.controller.set('isSaving', false);

        let errorMessage = 'Could not update user, please try again';
        this.toast.error(errorMessage);
      });
    }
  }
});
