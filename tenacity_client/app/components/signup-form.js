import Component from '@ember/component';
import { inject } from '@ember/service';

const isDuplicateEmailError = (err) => {
  return err &&
         err.payload &&
         err.payload.errors &&
         err.payload.errors.email &&
         err.payload.errors.email.includes('has already been taken');
}

export default Component.extend({
  ajax: Ember.inject.service(),
  session: inject('session'),
  store: inject(),

  actions: {
    goBack() {
      this.sendAction('onGoBack');
    },
    signup() {
      const data = {
        user: this.getProperties(
          'email',
          'first_name',
          'last_name',
          'phone',
          'password',
          'confirm_password'
        )
      };

      this.get('ajax').request('http://localhost:3000/users', {
        contentType: 'application/json',
        method: 'POST',
        data: data
      }).then(() => {
        const { email, password } = this.getProperties('email', 'password');

        const credentials = {
          user: {
            email: email,
            password: password
          }
        }
        const authenticator = 'authenticator:token';

        this.get('session').authenticate(authenticator, credentials);
      }).catch((err) => {
        if (isDuplicateEmailError(err)) {
          this.sendAction('onError', 'This email has already been taken.');
        }
        else {
          this.sendAction('onError', 'Could not log in, please try again');
        }
      });
    }
  }
});
