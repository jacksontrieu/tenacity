import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | index', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function(assert) {
    assert.expect(1);

    await visit('/');

    assert.equal(currentURL(), '/');
  });

  test('if logged in visiting / redirects to /dashboard', async function(assert) {
    assert.expect(1);

    await authenticateSession({
      id: 1,
      email: 'admin@user.com',
      name: 'Admin User',
      token: 'THIS_IS_A_TOKEN',
      role: 'admin_user'
    });

    await visit('/');

    assert.equal(currentURL(), '/dashboard');
  });
});
