import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import NoNavigationRouteMixin from '../mixins/no-navigation-route-mixin';
import { inject } from '@ember/service';
import { buildApiUrl, endpoints } from '../utils/api';
import { showWaitCursor } from '../utils/ui';

const toggleProgress = (inProgress, context) => {
  showWaitCursor(inProgress);
  context.controller.set('isSigningUp', inProgress);
};

const isDuplicateEmailError = (err) => {
  return err &&
         err.payload &&
         err.payload.errors &&
         err.payload.errors.email &&
         err.payload.errors.email.includes('has already been taken');
}

export default Route.extend(UnauthenticatedRouteMixin, NoNavigationRouteMixin, {
  ajax: inject(),
  session: inject('session'),
  store: inject(),

  actions: {
    signup() {
      const data = {
        user: this.controller.getProperties(
          'email',
          'first_name',
          'last_name',
          'phone',
          'password',
          'confirm_password'
        )
      };

      toggleProgress(true, this);

      this.get('ajax').request(buildApiUrl(endpoints.signup), {
        contentType: 'application/json',
        method: 'POST',
        data: data
      }).then(() => {
        const { email, password } = this.controller.getProperties('email', 'password');

        const credentials = {
          user: {
            email: email,
            password: password
          }
        }
        const authenticator = 'authenticator:token';

        this.get('session').authenticate(authenticator, credentials).then(() => {
          toggleProgress(false, this);
        }).catch(() => {
          toggleProgress(false, this);
          this.toast.error('We were able to register a new account but could not log in. Please contact support');
        });
      }).catch((err) => {
        toggleProgress(false, this);

        let errorMessage = 'Could not signup, please try again';
        if (isDuplicateEmailError(err)) {
          const { email } = this.controller.getProperties('email');
          errorMessage = `Email address ${email} has already been taken.`;
        }
        this.toast.error(errorMessage);
      });
    }
  }
});
