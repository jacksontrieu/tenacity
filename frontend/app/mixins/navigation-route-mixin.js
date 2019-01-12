import Ember from 'ember';
import { inject } from '@ember/service';
import { checkUserIsAdmin } from '../utils/auth';

// This route mixin will add a navigation menu to the top of the page.
const NavigationRouteMixin = Ember.Mixin.create({
  session: inject('session'),

  setupController: function(controller, model) {
    this._super(controller, model);

    const authInfo = this.get('session').data;
    const isUserAdmin = checkUserIsAdmin(authInfo);
    this.controllerFor('application').set('showNavigation', true);
    this.controllerFor('application').set('showAdminNavigationItems', isUserAdmin);
  }
});

export default NavigationRouteMixin;
