import { module, test } from 'qunit';
import { click, fillIn, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { validLoginResponse } from '../utils/responses/login';
import { validSignupResponse } from '../utils/responses/signup';
import { getAdminUserResponse } from '../utils/responses/users';
import { adminUserSessionHash } from '../utils/auth';
import { delay } from '../utils/helpers';

module('Acceptance | signup', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /signup', async function(assert) {
    assert.expect(1);

    await visit('/signup');

    assert.equal(currentURL(), '/signup');
  });

  test ('after signing up, redirected to /dashboard', async function(assert) {
    assert.expect(1);

    this.server.post('/api/v1/users', validSignupResponse, 200);
    this.server.post('/api/v1/login', validLoginResponse, 200);

    await visit('/signup');

    await fillIn('input.email-input', 'admin@user.com');
    await fillIn('input.first-name-input', 'Admin');
    await fillIn('input.last-name-input', 'User');
    await fillIn('input.phone-input', '0412 345 678');
    await fillIn('input.password-input', 'testing123$$');
    await fillIn('input.confirm-password-input', 'testing123$$');
    await click('button.signup-button');

    assert.equal(currentURL(), '/dashboard');
  });

  test ('after signing up, user can navigate to /profile', async function(assert) {
    // Testing that this bug is fixed:
    // https://github.com/jacksontrieu/tenacity/commit/866f4438df582bfd4368d13406b0a210e503dae6
    assert.expect(2);

    this.server.post('/api/v1/users', validSignupResponse, 200);
    this.server.post('/api/v1/login', validLoginResponse, 200);
    this.server.post('/api/v1/users/', validLoginResponse, 200);
    this.server.get(`/api/v1/users/${adminUserSessionHash.id}`, getAdminUserResponse, 200);

    await visit('/signup');

    await fillIn('input.email-input', 'admin@user.com');
    await fillIn('input.first-name-input', 'Admin');
    await fillIn('input.last-name-input', 'User');
    await fillIn('input.phone-input', '0412 345 678');
    await fillIn('input.password-input', 'testing123$$');
    await fillIn('input.confirm-password-input', 'testing123$$');
    await click('button.signup-button');

    assert.equal(currentURL(), '/dashboard');

    await visit('/profile');

    assert.equal(currentURL(), '/profile');
  });

  test ('if not all fields filled in, not redirected', async function(assert) {
    assert.expect(1);

    await visit('/signup');

    await fillIn('input.email-input', 'admin@user.com');
    await fillIn('input.first-name-input', 'Admin');
    await fillIn('input.last-name-input', 'User');
    await fillIn('input.phone-input', '0412 345 678');
    // - missing password fields here -
    await click('button.signup-button');

    assert.equal(currentURL(), '/signup');
  });

  test ('weak password shows an error toast and does not redirect', async function(assert) {
    assert.expect(2);

    this.server.post('/api/v1/users', {
      errors: {
        password: 'is too weak'
      }
    }, 400);

    await visit('/signup');

    await fillIn('input.email-input', 'weak@password.com');
    await fillIn('input.first-name-input', 'Admin');
    await fillIn('input.last-name-input', 'User');
    await fillIn('input.phone-input', '0412 345 678');
    await fillIn('input.password-input', 'weak');
    await fillIn('input.confirm-password-input', 'weak');
    await click('button.signup-button');

    let waitCount = 0;
    let toastContainer = null;
    while (!toastContainer && waitCount < 5000) {
      toastContainer = document.querySelector('#toast-container')
      await delay(25);
      waitCount += 25;
    }

    assert.dom('#toast-container', document).includesText('Password is too weak');

    assert.equal(currentURL(), '/signup');
  });

  test ('duplicate email address shows an error toast and does not redirect', async function(assert) {
    assert.expect(2);

    this.server.post('/api/v1/users', {
      errors: {
        email: 'Email duplicate@user.com has already been taken.'
      }
    }, 400);

    await visit('/signup');

    await fillIn('input.email-input', 'duplicate@user.com');
    await fillIn('input.first-name-input', 'Admin');
    await fillIn('input.last-name-input', 'User');
    await fillIn('input.phone-input', '0412 345 678');
    await fillIn('input.password-input', 'testing123$$');
    await fillIn('input.confirm-password-input', 'testing123$$');
    await click('button.signup-button');

    let waitCount = 0;
    let toastContainer = null;
    while (!toastContainer && waitCount < 5000) {
      toastContainer = document.querySelector('#toast-container')
      await delay(25);
      waitCount += 25;
    }

    assert.dom('#toast-container', document).includesText('has already been taken');

    assert.equal(currentURL(), '/signup');
  });

  test ('if already logged in, visiting /signup redirects to /dashboard', async function(assert) {
    assert.expect(1);

    await authenticateSession(adminUserSessionHash);

    await visit('/signup');

    assert.equal(currentURL(), '/dashboard');
  });
});
