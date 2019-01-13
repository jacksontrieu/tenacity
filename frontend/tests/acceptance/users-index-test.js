import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | users-index', function(hooks) {
  setupApplicationTest(hooks);

  test('if not logged in visiting /users redirects to root', async function(assert) {
    await visit('/users');

    assert.equal(currentURL(), '/');
  });
});
