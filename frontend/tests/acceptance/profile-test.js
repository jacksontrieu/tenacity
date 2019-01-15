import { module, test } from 'qunit';
import { click, fillIn, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { adminUserSessionHash } from '../utils/auth';

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

    this.server.get(`/api/v1/users/${adminUserSessionHash.id}`, (schema) => {
      return schema.users.find(adminUserSessionHash.id);
    });

    await authenticateSession(adminUserSessionHash);
    await visit('/profile');

    const expectedLoadedUser = this.server.db.users.find(adminUserSessionHash.id);
    assert.equal(currentURL(), '/profile');
    assert.equal(expectedLoadedUser.first_name, this.element.querySelector('.first-name-input').value);
    assert.equal(expectedLoadedUser.last_name, this.element.querySelector('.last-name-input').value);
    assert.equal(expectedLoadedUser.phone, this.element.querySelector('.phone-input').value);
  });

  test('redirected to /dashboard if update profile API call is successful', async function(assert) {
    assert.expect(1);

    this.server.get(`/api/v1/users/${adminUserSessionHash.id}`, (schema) => {
      return schema.users.find(adminUserSessionHash.id);
    });
    this.server.patch(`/api/v1/users/${adminUserSessionHash.id}`, (schema) => {
      return schema.users.find(adminUserSessionHash.id);
    });
    this.server.put(`/api/v1/users/${adminUserSessionHash.id}`, (schema) => {
      return schema.users.find(adminUserSessionHash.id);
    });

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

  test('no PATCH/PUT API call made if first name not entered', async function(assert) {
    assert.expect(1);

    this.server.get(`/api/v1/users/${adminUserSessionHash.id}`, (schema) => {
      return schema.users.find(adminUserSessionHash.id);
    });

    await authenticateSession(adminUserSessionHash);
    await visit('/profile');
    await fillIn('input.first-name-input', '');
    await click('button.save-button');

    assert.equal(currentURL(), '/profile');
  });

  test('no PATCH/PUT API call made if last name not entered', async function(assert) {
    assert.expect(1);

    this.server.get(`/api/v1/users/${adminUserSessionHash.id}`, (schema) => {
      return schema.users.find(adminUserSessionHash.id);
    });

    await authenticateSession(adminUserSessionHash);
    await visit('/profile');
    await fillIn('input.last-name-input', '');
    await click('button.save-button');

    assert.equal(currentURL(), '/profile');
  });

  test('no PATCH/PUT API call made if phone not entered', async function(assert) {
    assert.expect(1);

    this.server.get(`/api/v1/users/${adminUserSessionHash.id}`, (schema) => {
      return schema.users.find(adminUserSessionHash.id);
    });

    await authenticateSession(adminUserSessionHash);
    await visit('/profile');
    await fillIn('input.phone-input', '');
    await click('button.save-button');

    assert.equal(currentURL(), '/profile');
  });

  test('clicking Change password button redirects to /change-password', async function(assert) {
    assert.expect(1);

    this.server.get(`/api/v1/users/${adminUserSessionHash.id}`, (schema) => {
      return schema.users.find(adminUserSessionHash.id);
    });
    this.server.get(`/api/v1/passwords/${adminUserSessionHash.id}`, (schema) => {
      return schema.passwords.find(1);
    });

    await authenticateSession(adminUserSessionHash);
    await visit('/profile');
    await click('a.change-password-link');

    assert.equal(currentURL(), '/change-password');
  });
});
