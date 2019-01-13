import { module, test } from 'qunit';
import { click, fillIn, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | signup', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /signup', async function(assert) {
    await visit('/signup');

    assert.equal(currentURL(), '/signup');
  });

  test ('after signing up, redirected to /dashboard', async function(assert) {
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

  test ('if not all fields filled in, not redirected', async function(assert) {
    await visit('/signup');

    await fillIn('input.email-input', 'admin@user.com');
    await fillIn('input.first-name-input', 'Admin');
    await fillIn('input.last-name-input', 'User');
    await fillIn('input.phone-input', '0412 345 678');
    // - missing password fields here -
    await click('button.signup-button');

    assert.equal(currentURL(), '/signup');
  });

  test ('after failed signup, not redirected', async function(assert) {
    await visit('/signup');

    await fillIn('input.email-input', 'duplicate@user.com');
    await fillIn('input.first-name-input', 'Admin');
    await fillIn('input.last-name-input', 'User');
    await fillIn('input.phone-input', '0412 345 678');
    await fillIn('input.password-input', 'testing123$');
    await fillIn('input.confirm-password-input', 'testing123$');
    await click('button.signup-button');

    assert.equal(currentURL(), '/signup');
  });

  test ('if already logged in, visiting /signup redirects to /dashboard', async function(assert) {
    await authenticateSession({
      id: 1,
      email: 'admin@user.com',
      name: 'Admin User',
      token: 'THIS_IS_A_TOKEN',
      role: 'admin_user'
    });

    await visit('/signup');

    assert.equal(currentURL(), '/dashboard');
  });
});
