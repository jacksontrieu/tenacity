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
      const authInfo = this.get('session').data;
      const loggedInUserId = authInfo.authenticated.id;

      let self = this;

      showWaitCursor(true);
      this.controller.set('isSaving', true);

      this.store.findRecord('password', loggedInUserId).then(function(password) {
        if (password.new_password != password.confirm_password) {
          self.toast.error("The new password doesn't match.");
          self.controller.set('isSaving', false);
          showWaitCursor(false);
          return;
        }

        password.save().then(() => {
          // Clear the password model from the Ember data store to prevent
          // security issues.
          self.store.unloadAll('password');

          showWaitCursor(false);

          self.transitionTo('dashboard');
          self.toast.success('Your password was changed successfully');
        }).catch((err) => {
          self.controller.set('isSaving', false);

          showWaitCursor(false);

          let errorMessage = 'Could not change password, please try again.';
          if (err.payload && err.payload.error) {
            errorMessage = err.payload.error;
          }
          else if (err.payload && err.payload.message) {
            errorMessage = err.payload.message;
          }

          self.toast.error(errorMessage);
        });
      });
    }
  },

  model() {
    this.store.unloadAll('password');

    const authInfo = this.get('session').data;
    const loggedInUserId = authInfo.authenticated.id;

    this.store.push({
      "data": {
        "id": loggedInUserId.toString(),
        "type": "password",
        "links": {
          "self": "/password/1"
        },
        "attributes": {
          "id": "1",
          "current_password": "",
          "new_password": "",
          "confirm_password": ""
        }
      }
    });

    return this.store.findRecord('password', loggedInUserId);
  }
});
