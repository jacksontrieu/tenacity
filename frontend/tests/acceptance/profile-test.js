import { module, test } from 'qunit';
import { click, fillIn, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { adminUserSessionHash } from '../utils/auth';
import { getAdminUserResponse } from '../utils/responses/users';
import { delay } from '../utils/helpers';

module('Acceptance | profile', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('if not logged in visiting /profile redirects to root', async function(assert) {
    assert.expect(1);

    await visit('/profile');

    assert.equal(currentURL(), '/');
  });

  test('if logged in visiting /profile renders profile page and loads user details', async function(assert) {
    assert.expect(4);

    this.server.get(`/api/v1/users/${adminUserSessionHash.id}`, getAdminUserResponse, 200);

    await authenticateSession(adminUserSessionHash);

    await visit('/profile');

    assert.equal(currentURL(), '/profile');
    assert.equal(getAdminUserResponse.first_name, this.element.querySelector('.first-name-input').value);
    assert.equal(getAdminUserResponse.last_name, this.element.querySelector('.last-name-input').value);
    assert.equal(getAdminUserResponse.phone, this.element.querySelector('.phone-input').value);
  });

  test('redirected to /dashboard if update profile API call is successful', async function(assert) {
    assert.expect(1);

    this.server.get(`/api/v1/users/${adminUserSessionHash.id}`, getAdminUserResponse, 200);
    this.server.put(`/api/v1/users/${adminUserSessionHash.id}`, {}, 200);

    await authenticateSession(adminUserSessionHash);

    await visit('/profile');

    const newInputData = {
      firstName: '- NEW FIRST NAME -',
      lastName: '- NEW LAST NAME -',
      phone: '- NEW PHONE # -'
    }

    await fillIn('input.first-name-input', newInputData.firstName);
    await fillIn('input.last-name-input', newInputData.lastName);
    await fillIn('input.phone-input', newInputData.phone);
    await click('button.save-button');

    assert.equal(currentURL(), '/dashboard');
  });

  test('no API call made if first name not entered', async function(assert) {
    assert.expect(1);
    let done = assert.async();

    this.server.get(`/api/v1/users/${adminUserSessionHash.id}`, getAdminUserResponse, 200);
    this.server.put(`/api/v1/users/${adminUserSessionHash.id}`, () => {
      // This assertion should not run because we are not expecting an API call
      // to be made.
      assert.equal(1, 2);
      done();
    });

    await authenticateSession(adminUserSessionHash);

    await visit('/profile');

    await fillIn('input.first-name-input', '');
    await click('button.save-button');

    assert.equal(currentURL(), '/profile');

    // Give the Mirage put request time to respond and throw a bad assertion if
    // for some reason an unexpected API call is made.
    await delay(100);

    done();
  });

  test('no API call made if last name not entered', async function(assert) {
    assert.expect(1);
    let done = assert.async();

    this.server.get(`/api/v1/users/${adminUserSessionHash.id}`, getAdminUserResponse, 200);
    this.server.put(`/api/v1/users/${adminUserSessionHash.id}`, () => {
      // This assertion should not run because we are not expecting an API call
      // to be made.
      assert.equal(1, 2);
      done();
    });

    await authenticateSession(adminUserSessionHash);

    await visit('/profile');

    await fillIn('input.last-name-input', '');
    await click('button.save-button');

    assert.equal(currentURL(), '/profile');

    // Give the Mirage put request time to respond and throw a bad assertion if
    // for some reason an unexpected API call is made.
    await delay(100);

    done();
  });

  test('no API call made if phone not entered', async function(assert) {
    assert.expect(1);
    let done = assert.async();

    this.server.get(`/api/v1/users/${adminUserSessionHash.id}`, getAdminUserResponse, 200);
    this.server.put(`/api/v1/users/${adminUserSessionHash.id}`, () => {
      // This assertion should not run because we are not expecting an API call
      // to be made.
      assert.equal(1, 2);
      done();
    });

    await authenticateSession(adminUserSessionHash);

    await visit('/profile');

    await fillIn('input.phone-input', '');
    await click('button.save-button');

    assert.equal(currentURL(), '/profile');

    // Give the Mirage put request time to respond and throw a bad assertion if
    // for some reason an unexpected API call is made.
    await delay(100);

    done();
  });

  test('clicking Change password button redirects to /change-password', async function(assert) {
    assert.expect(1);

    this.server.get(`/api/v1/users/${adminUserSessionHash.id}`, getAdminUserResponse, 200);

    await authenticateSession(adminUserSessionHash);

    await visit('/profile');
    await click('a.change-password-link');

    assert.equal(currentURL(), '/change-password');
  });
});
