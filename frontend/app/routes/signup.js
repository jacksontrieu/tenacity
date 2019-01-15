import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import NoNavigationRouteMixin from '../mixins/no-navigation-route-mixin';
import { inject } from '@ember/service';
import { toggleProgress } from '../utils/ui';
import { createLoginPostBody } from '../utils/auth';

export default Route.extend(UnauthenticatedRouteMixin, NoNavigationRouteMixin, {
  ajax: inject(),
  session: inject('session'),

  actions: {
    signup() {
      let self = this;

      toggleProgress(true, this);

      const model = this.controller.get('model');

      if (model.password != this.controller.get('confirm_password')) {
        toggleProgress(false, self);
        this.toast.error("Passwords don't match.")
        return;
      }

      model.save().then(function() {
        // Login.
        const credentials = createLoginPostBody(model.email, model.password)
        const authenticator = 'authenticator:token';
        self.get('session').authenticate(authenticator, credentials).then(() => {
          toggleProgress(false, self);
        }).catch(() => {
          toggleProgress(false, self);
          self.toast.error('We were able to register a new account but could not log in. Please contact support.');
        });
      }).catch(() => {
        toggleProgress(false, self);

        let errorMessage = 'Could not sign up, please try again';
        self.toast.error(errorMessage);
      });
    }
  },
  model() {
    return this.store.createRecord('new-signup', {});
  }
});
