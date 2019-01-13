import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

// function setupRouter({ container }) {
//   const router = container.lookup('router:main');
//   router.startRouting(true);
// }

module('Integration | Component | cell-edit-icon', function(hooks) {
  setupRenderingTest(hooks);
  test('it renders', async function(assert) {
    // Need to turn on the router for this test because this component uses a
    // link-to helper which requries a router, as per:
    // https://stackoverflow.com/a/53735725
    this.owner.lookup('router:main').setupRouter();

    await render(hbs`{{cell-edit-icon value=1}}`);

    assert.equal(
      this.element.querySelector('a').getAttribute('href'),
      '/users/1',
      'References edit users route with :id'
    );
  });
});
