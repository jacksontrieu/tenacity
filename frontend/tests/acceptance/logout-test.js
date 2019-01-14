import { module, test } from 'qunit';
import { click, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { currentSession, authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | logout', function(hooks) {
  setupApplicationTest(hooks);

  test('clicking Logout nav item invalidates session data', async function(assert) {
    assert.expect(1);

    await authenticateSession({
      id: 1,
      email: 'admin@user.com',
      name: 'Admin User',
      token: 'THIS_IS_A_TOKEN',
      role: 'admin_user'
    });

    await visit('/');

    await click('a.logout-nav-item');

    const session = currentSession();
    const sessionData = JSON.parse(session.store._data);

    assert.equal(Object.keys(sessionData.authenticated).length, 0);
  });
});
