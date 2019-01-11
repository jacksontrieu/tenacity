import Component from '@ember/component';

export default Component.extend({
  actions: {
    goBack() {
      this.sendAction('onGoBack');
    }
  }
});
