import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | error-message', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(1);

    const expectedMessage = 'THIS IS BAD';
    this.set('errorMessage', expectedMessage);

    await render(hbs`{{error-message errorMessage=errorMessage}}`);

    assert.equal(this.element.textContent.trim(), expectedMessage);
  });
});
