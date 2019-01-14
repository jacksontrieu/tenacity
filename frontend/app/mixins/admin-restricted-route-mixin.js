import Mixin from '@ember/object/mixin';
import { inject } from '@ember/service';
import { checkUserIsAdmin } from '../utils/auth';

// This route mixin will redirect non-admin users to the unauthorized page.
const AdminRestrictedRouteMixin = Mixin.create({
  session: inject('session'),

  beforeModel(transition) {
    this._super(...arguments);

    if (transition.isAborted) {
      // Another mixin already aborted the original transition to this route.
      // Give that mixin precedence.
      return;
    }

    const authInfo = this.get('session').data;
    const isUserAdmin = checkUserIsAdmin(authInfo);

    if (!isUserAdmin) {
      // Need to manually remove the 'users' class that is added to the <body>
      // tag but the embed-body-class library as it will not automatically remove
      // this class when we transition to the unauthorized page.
      document.querySelector('body').classList.remove('users');

      this.transitionTo('unauthorized');
    }
  }
});

export default AdminRestrictedRouteMixin;
