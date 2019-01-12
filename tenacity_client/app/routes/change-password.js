import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import NavigationRouteMixin from '../mixins/navigation-route-mixin';
import { inject } from '@ember/service';
import { showWaitCursor } from '../utils/ui';
import { buildApiUrl, endpoints } from '../utils/api';

export default Route.extend(AuthenticatedRouteMixin, NavigationRouteMixin, {
  ajax: inject(),

  actions: {
    save: function() {
      const data = this.controller.getProperties('current_password', 'new_password', 'confirm_password');

      showWaitCursor(true);
      this.controller.set('isSaving', true);

      this.get('ajax').request(buildApiUrl(endpoints.update_password), {
        contentType: 'application/json',
        method: 'PUT',
        data: data
      }).then(() => {
        showWaitCursor(false);
        this.transitionTo('dashboard');
        this.toast.success('Your password was changed successfully');
      }).catch((err) => {
        showWaitCursor(false);
        this.controller.set('isSaving', false);

        let errorMessage = 'Could not change password, please try again.';
        if (err.payload && err.payload.error) {
          errorMessage = err.payload.error;
        }

        this.toast.error(errorMessage);
      });
    }
  }
});
