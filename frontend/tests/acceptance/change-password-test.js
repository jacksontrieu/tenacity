import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | change password', function(hooks) {
  setupApplicationTest(hooks);

  test('if not logged in visiting /change-password redirects to root', async function(assert) {
    await visit('/change-password');

    assert.equal(currentURL(), '/');
  });
});
