import { module, test } from 'qunit';
import { click, fillIn, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { validLoginResponse } from '../utils/responses/login';
import { adminUserSessionHash } from '../utils/auth';

module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /login', async function(assert) {
    assert.expect(1);

    await visit('/login');

    assert.equal(currentURL(), '/login');
  });

  test ('after logging in redirected to /dashboard', async function(assert) {
    assert.expect(1);

    this.server.post('/api/v1/login', validLoginResponse, 200);

    await visit('/login');
    await fillIn('input.email-input', 'admin@user.com');
    await fillIn('input.password-input', 'testing123$');
    await click('button.login-button');

    assert.equal(currentURL(), '/dashboard');
  });

  test ('after failed login, not redirected', async function(assert) {
    assert.expect(1);

    this.server.post('/api/v1/login', {}, 401);

    await visit('/login');
    await fillIn('input.email-input', 'invalid@user.com');
    await fillIn('input.password-input', 'testing123$');
    await click('button.login-button');

    assert.equal(currentURL(), '/login');
  });

  test ('if already logged in, visiting /login redirects to /dashboard', async function(assert) {
    assert.expect(1);

    await authenticateSession(adminUserSessionHash);
    await visit('/login');

    assert.equal(currentURL(), '/dashboard');
  });
});
