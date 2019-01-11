import Controller from '@ember/controller';

export default Controller.extend({
  showLogin: false,
  showSignUp: false,
  signUpErrorMessage: '',

  actions: {
    showChoices() {
      this.set('showLogin', false);
      this.set('showSignUp', false);
    },
    showLogin() {
      this.set('showLogin', true);
      this.set('showSignUp', false);
    },
    showSignUp() {
      this.set('showLogin', false);
      this.set('showSignUp', true);
    },
    showSignUpError(message) {
      this.set('signUpErrorMessage', message);
    }
  }
});
