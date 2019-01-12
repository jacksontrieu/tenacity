import Ember from 'ember';
import { inject } from '@ember/service';
import AjaxService from 'ember-ajax/services/ajax';
import ENV from 'tenacity-client/config/environment';

// From https://github.com/ember-cli/ember-ajax#custom-request-headers.
export default AjaxService.extend({
  session: inject('session'),
  trustedHosts: [ENV['api_host']],
  headers: Ember.computed('session.authToken', {
    get() {
      let headers = {};

      let storedSessionInfo = this.get('session').data;
      if (storedSessionInfo.authenticated) {
        headers['Authorization'] = 'Bearer ' + storedSessionInfo.authenticated.token;
      }
      return headers;
    }
  })
});
