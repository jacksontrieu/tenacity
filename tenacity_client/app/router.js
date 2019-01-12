import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('dashboard');
  this.route('profile');
  this.route('change-password');
  this.route('signup');
  this.route('users');
  this.route('unauthorized');
});

export default Router;
