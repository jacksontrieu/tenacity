import { computed } from '@ember/object';
import { inject } from '@ember/service';
import AjaxService from 'ember-ajax/services/ajax';
import ENV from 'tenacity-client/config/environment';

// From https://github.com/ember-cli/ember-ajax#custom-request-headers.
export default AjaxService.extend({
  init() {
    this._super(...arguments);
    this.trustedHosts = [ENV['TENACITY_API_HOST']];
  },

  session: inject('session'),
  // trustedHosts: [ENV['TENACITY_API_HOST']],
  headers: computed('session.authToken', {
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
