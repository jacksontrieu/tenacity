import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  session: inject('session'),

  actions: {
    authenticate: function() {
      const { email, password } = this.getProperties('email', 'password');
      const credentials = {
        user: {
          email: email,
          password: password
        }
      }
      const authenticator = 'authenticator:token';

      this.get('session').authenticate(authenticator, credentials);
    },
    goBack: function() {
      this.sendAction('onGoBack');
    }
  }
});
