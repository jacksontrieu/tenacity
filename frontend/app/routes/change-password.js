import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import NavigationRouteMixin from '../mixins/navigation-route-mixin';
import { inject } from '@ember/service';
import { showWaitCursor } from '../utils/ui';

export default Route.extend(AuthenticatedRouteMixin, NavigationRouteMixin, {
  ajax: inject(),
  session: inject('session'),

  actions: {
    save: function() {
      let self = this;

      showWaitCursor(true);
      this.controller.set('isSaving', true);

      const password = this.controller.get('model');
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
    }
  },

  model() {
    this.store.unloadAll('password');

    const authInfo = this.get('session').data;
    const loggedInUserId = authInfo.authenticated.id;

    // Fake a 'saved' password model so that a PATCH/PUT request will be made
    // when we update the model & call model.save() in the save() action.
    // If we don't fake this model, then a POST request will be made when we
    // call model.save(), which is incorrect as we are updating the password.
    this.store.push({
      data: [{
        id: parseInt(loggedInUserId),
        type: 'password',
        attributes: {
          current_password: '',
          new_password: '',
          confirm_password: ''
        },
        relationships: {}
      }]
    });

    // Get the record that was pushed & cached in the store. Set both reload
    // options to  false so that a GET request is not made to the server, since
    // there is no GET /passwords/:id endpoint, and we are merely faking this
    // data.
    return this.store.findRecord('password', loggedInUserId, {
      backgroundReload: false,
      reload: false
    });
  }
});
