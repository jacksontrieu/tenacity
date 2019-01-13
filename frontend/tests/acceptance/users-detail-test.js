import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | users detail', function(hooks) {
  setupApplicationTest(hooks);

  test('if not logged in visiting /users/:id redirects to root', async function(assert) {
    await visit('/users/1');

    assert.equal(currentURL(), '/');
  });
});