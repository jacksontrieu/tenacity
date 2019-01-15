import Component from '@ember/component';
import { inject } from '@ember/service';
import { showWaitCursor } from '../utils/ui';
import { buildApiUrl, endpoints } from '../utils/api';

export default Component.extend({
  ajax: inject(),
  session: inject('session'),
  actions: {
    logout() {
      showWaitCursor(true);

      this.get('ajax').request(buildApiUrl(endpoints.logout), {
        contentType: 'application/json',
        method: 'DELETE'
      }).then(() => {
        showWaitCursor(false);
        this.get('session').invalidate();
      }).catch((err) => {
        showWaitCursor(false);
      });
    }
  }
});
