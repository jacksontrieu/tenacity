import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | loading-spinner', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders a spinner when visible', async function(assert) {
    await render(hbs`{{loading-spinner visible=true}}`);
    assert.ok(this.element.querySelector('.loading-spinner-component'), 'A spinner is rendered.');
  });

  test("it doesn't renders a spinner when not visible", async function(assert) {
    await render(hbs`{{loading-spinner visible=false}}`);
    assert.notOk(this.element.querySelector('.loading-spinner-component'), 'A spinner is not rendered.');
  });
});
