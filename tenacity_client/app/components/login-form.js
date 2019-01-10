import Ember from 'ember';
import { inject } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  session: inject('session'),

  actions: {
    authenticate: function() {
      // let { identification, password } = this.getProperties('username', 'password');
      // return this.get('session').authenticate('authenticator:devise', identification, password).catch((reason) => {
      //   this.set('errorMessage', reason.error);
      // });
      const { email, password } = this.getProperties('email', 'password');
      const credentials = {
        user: {
          email: email,
          password: password
        }
      }
      const authenticator = 'authenticator:token'; // or 'authenticator:jwt'

      this.get('session').authenticate(authenticator, credentials);
    }
  }
});
