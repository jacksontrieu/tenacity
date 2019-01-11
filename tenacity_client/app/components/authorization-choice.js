import Component from '@ember/component';

export default Component.extend({
  actions: {
    signupClick() {
      this.sendAction('onSignupClick');
    },
    loginClick() {
      this.sendAction('onLoginClick');
    }
  }
});
