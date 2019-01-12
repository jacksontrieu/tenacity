import Ember from 'ember';

// This route mixin will prevent the controller from rendering the navigation
// menu.
const NoNavigationRouteMixin = Ember.Mixin.create({
  setupController: function(controller, model) {
    this._super(controller, model);

    this.controllerFor('application').set('showNavigation', false);
  }
});

export default NoNavigationRouteMixin;
