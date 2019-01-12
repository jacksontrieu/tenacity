import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import NavigationRouteMixin from '../mixins/navigation-route-mixin';
import { inject } from '@ember/service';
import { showWaitCursor } from '../utils/ui';
import { buildApiUrl, endpoints } from '../utils/api';

export default Route.extend(AuthenticatedRouteMixin, NavigationRouteMixin, {
  ajax: inject(),
  session: inject('session'),

  actions: {
    goBack: function() {
      this.transitionTo('dashboard');
    },
    goToChangePassword: function() {
      this.transitionTo('change-password');
    },
    save: function() {
      const data = {
        user: this.controller.get('model')
      };

      showWaitCursor(true);
      this.controller.set('isSaving', true);

      this.get('ajax').request(buildApiUrl(endpoints.update_profile), {
        contentType: 'application/json',
        method: 'PUT',
        data: data
      }).then((response) => {
        // ember-simple-auth-token stores authorization info in a
        // session service, backed by the Browser's local storage. We need to
        // manually update the name set in this auth info as it may have
        // changed when the user updated their profile.
        const authInfo = this.get('session').data;

        const newAuthInfo = {
          ...authInfo,
          authenticated: {
            ...authInfo.authenticated,
            name: (data.user.first_name + ' ' + data.user.last_name).trim()
          }
        }
        this.set('session.data', newAuthInfo);

        showWaitCursor(false);
        this.transitionTo('dashboard');
        this.toast.success('Your profile was successfully updated');
      }).catch((err) => {
        showWaitCursor(false);
        this.controller.set('isSaving', false);

        let errorMessage = 'Could not update profile, please try again';
        this.toast.error(errorMessage);
      });
    }
  },
  model() {
    const authInfo = this.get('session').data;
    return this.get('ajax').request(buildApiUrl(endpoints.get_user_details(authInfo.authenticated.id)));
  }
});
