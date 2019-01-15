import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import NoNavigationRouteMixin from '../mixins/no-navigation-route-mixin';
import { inject } from '@ember/service';
import { showWaitCursor } from '../utils/ui';
import { createLoginPostBody } from '../utils/auth';

const toggleProgress = (inProgress, context) => {
  showWaitCursor(inProgress);
  context.controller.set('isLoggingIn', inProgress);
};

export default Route.extend(UnauthenticatedRouteMixin, NoNavigationRouteMixin, {
  session: inject('session'),

  actions: {
    authenticate: function() {
      toggleProgress(true, this);

      const { email, password } = this.controller.getProperties('email', 'password');
      const credentials = createLoginPostBody(email, password)
      const authenticator = 'authenticator:token';

      this.get('session').authenticate(authenticator, credentials).then(() => {
        toggleProgress(false, this);
      }).catch(() => {
        toggleProgress(false, this);
        this.toast.error('The username or password you entered is incorrect, try again.');
      });
    }
  }
});
