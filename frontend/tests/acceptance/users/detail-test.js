import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | users/detail', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /users/detail', async function(assert) {
    await visit('/users/detail');

    assert.equal(currentURL(), '/users/detail');
  });
});
