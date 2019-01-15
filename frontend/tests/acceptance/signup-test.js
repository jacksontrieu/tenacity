import { module, test } from 'qunit';
import { click, fillIn, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { adminUserSessionHash } from '../utils/auth';
import { generateJsonApiErrors } from '../utils/error-helpers';
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

    this.server.post('/api/v1/users', (schema) => {
      return schema.newSignups.find(10);
    });
    this.server.post('/api/v1/login', (schema) => {
      return schema.loginResults.find(10);
    });

    await visit('/signup');
    await fillIn('input.email-input', 'admin@user.com');
    await fillIn('input.first-name-input', 'Admin');
    await fillIn('input.last-name-input', 'User');
    await fillIn('input.phone-input', '0412 345 678');
    await fillIn('input.password-input', 'testing123$');
    await fillIn('input.confirm-password-input', 'testing123$');
    await click('button.signup-button');

    assert.equal(currentURL(), '/dashboard');
  });

  test ('after signing up, user can navigate to /profile', async function(assert) {
    // Testing that this bug is fixed:
    // https://github.com/jacksontrieu/tenacity/commit/866f4438df582bfd4368d13406b0a210e503dae6
    assert.expect(2);

    this.server.post('/api/v1/users', (schema) => {
      return schema.newSignups.find(10);
    });
    this.server.post('/api/v1/login', (schema) => {
      return schema.loginResults.find(10);
    });
    this.server.get(`/api/v1/users/10`, (schema) => {
      return schema.users.find(10);
    });

    await visit('/signup');
    await fillIn('input.email-input', 'admin@user.com');
    await fillIn('input.first-name-input', 'Admin');
    await fillIn('input.last-name-input', 'User');
    await fillIn('input.phone-input', '0412 345 678');
    await fillIn('input.password-input', 'testing123$');
    await fillIn('input.confirm-password-input', 'testing123$');
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
    assert.expect(3);

    const errorMessage = "Complexity requirement not met. Length should be 8-70 characters and include: 1 uppercase, 1 lowercase, 1 digit and 1 special character.";
    const responseBody = generateJsonApiErrors('password', errorMessage);
    this.server.post('/api/v1/users', responseBody, 422);

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

    assert.dom('#toast-container', document).includesText('Could not sign up, please try again');
    assert.dom('.input-error').includesText(errorMessage);
    assert.equal(currentURL(), '/signup');
  });

  test ('duplicate email address shows an error toast and does not redirect', async function(assert) {
    assert.expect(3);

    const errorMessage = 'Email duplicate@user.com has already been taken.';
    const responseBody = generateJsonApiErrors('password', errorMessage);
    this.server.post('/api/v1/users', responseBody, 422);

    await visit('/signup');
    await fillIn('input.email-input', 'duplicate@user.com');
    await fillIn('input.first-name-input', 'Admin');
    await fillIn('input.last-name-input', 'User');
    await fillIn('input.phone-input', '0412 345 678');
    await fillIn('input.password-input', 'testing123$');
    await fillIn('input.confirm-password-input', 'testing123$');
    await click('button.signup-button');

    let waitCount = 0;
    let toastContainer = null;
    while (!toastContainer && waitCount < 5000) {
      toastContainer = document.querySelector('#toast-container')
      await delay(25);
      waitCount += 25;
    }

    assert.dom('#toast-container', document).includesText('Could not sign up, please try again');
    assert.dom('.input-error').includesText(errorMessage);
    assert.equal(currentURL(), '/signup');
  });

  test ('if already logged in, visiting /signup redirects to /dashboard', async function(assert) {
    assert.expect(1);

    await authenticateSession(adminUserSessionHash);
    await visit('/signup');

    assert.equal(currentURL(), '/dashboard');
  });
});
