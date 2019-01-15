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
    save: function() {
      let self = this;

      showWaitCursor(true);
      this.controller.set('isSaving', true);

      const authInfo = this.get('session').data;
      const loggedInUserId = authInfo.authenticated.id;

      this.store.findRecord('user', loggedInUserId).then(function(user) {
        user.save().then(() => {
          // ember-simple-auth-token stores authorization info in a
          // session service, backed by the Browser's local storage. We need to
          // manually update the name set in this auth info as it may have
          // changed when the user updated their profile.
          const newAuthInfo = {
            ...authInfo,
            authenticated: {
              ...authInfo.authenticated,
              name: (user.first_name + ' ' + user.last_name).trim() // Refactor this.
            }
          }
          self.set('session.data', newAuthInfo);

          showWaitCursor(false);
          self.controller.set('isSaving', false);
          self.transitionTo('dashboard');
          self.toast.success('Your profile was successfully updated');
        }).catch(() => {
          self.controller.set('isSaving', false);

          showWaitCursor(false);

          let errorMessage = 'Could not update profile, please try again';
          self.toast.error(errorMessage);
        });
      });
    }
  },
  model() {
    const authInfo = this.get('session').data;
    return this.store.findRecord('user', authInfo.authenticated.id);
  }
});
