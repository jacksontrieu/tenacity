import { module, test } from 'qunit';
import { click, fillIn, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { getAdminUserResponse, getUsersResponse } from '../../utils/responses/users';
import { adminUserSessionHash, standardUserSessionHash } from '../../utils/auth';
import { delay } from '../../utils/helpers';

module('Acceptance | users/edit', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('if not logged in visiting /users/:id redirects to root', async function(assert) {
    assert.expect(1);

    await visit('/users/1');

    assert.equal(currentURL(), '/');
  });

  test('admin user can visit /users/:id and edit user page is rendered and loads user details', async function(assert) {
    assert.expect(4);

    const requestedUser = getUsersResponse.users[0];

    this.server.get(`/api/v1/users/${requestedUser.id}`, getAdminUserResponse, 200);

    await authenticateSession(adminUserSessionHash);

    await visit(`/users/${requestedUser.id}`);

    assert.equal(currentURL(), `/users/${requestedUser.id}`);

    assert.equal(this.element.querySelector('.first-name-input').value, requestedUser.first_name);
    assert.equal(this.element.querySelector('.last-name-input').value, requestedUser.last_name,);
    assert.equal(this.element.querySelector('.phone-input').value, requestedUser.phone);
  });

  test('standard user is redirected to /unauthorized when visiting /users/:id', async function(assert) {
    assert.expect(1);

    await authenticateSession(standardUserSessionHash);

    await visit('/users/1');

    assert.equal(currentURL(), '/unauthorized');
  });

  test('redirected to /users if update user API call is successful', async function(assert) {
    assert.expect(1);

    const requestedUser = getUsersResponse.users[0];

    this.server.get(`/api/v1/users/${requestedUser.id}`, getAdminUserResponse, 200);
    this.server.put(`/api/v1/users/${requestedUser.id}`, getAdminUserResponse, 200);
    this.server.get('/api/v1/users', getUsersResponse, 200);

    await authenticateSession(adminUserSessionHash);

    await visit(`/users/${requestedUser.id}`);

    const newInputData = {
      firstName: '- NEW FIRST NAME -',
      lastName: '- NEW LAST NAME -',
      phone: '- NEW PHONE # -'
    };

    await fillIn('input.first-name-input', newInputData.firstName);
    await fillIn('input.last-name-input', newInputData.lastName);
    await fillIn('input.phone-input', newInputData.phone);
    await click('button.save-button');

    assert.equal(currentURL(), '/users');
  });

  test('no API call made if first name not entered', async function(assert) {
    assert.expect(1);
    let done = assert.async();

    const requestedUser = getUsersResponse.users[0];

    this.server.get(`/api/v1/users/${requestedUser.id}`, getAdminUserResponse, 200);
    this.server.put(`/api/v1/users/${requestedUser.id}`, () => {
      // This assertion should not run because we are not expecting an API call
      // to be made.
      assert.equal(1, 2);
      done();
    });

    await authenticateSession(adminUserSessionHash);

    await visit(`/users/${requestedUser.id}`);

    await fillIn('input.first-name-input', '');
    await click('button.save-button');

    assert.equal(currentURL(), `/users/${requestedUser.id}`);

    // Give the Mirage put request time to respond and throw a bad assertion if
    // for some reason an unexpected API call is made.
    await delay(100);

    done();
  });

  test('no API call made if last name not entered', async function(assert) {
    assert.expect(1);
    let done = assert.async();

    const requestedUser = getUsersResponse.users[0];

    this.server.get(`/api/v1/users/${requestedUser.id}`, getAdminUserResponse, 200);
    this.server.put(`/api/v1/users/${requestedUser.id}`, () => {
      // This assertion should not run because we are not expecting an API call
      // to be made.
      assert.equal(1, 2);
      done();
    });

    await authenticateSession(adminUserSessionHash);

    await visit(`/users/${requestedUser.id}`);

    await fillIn('input.last-name-input', '');
    await click('button.save-button');

    assert.equal(currentURL(), `/users/${requestedUser.id}`);

    // Give the Mirage put request time to respond and throw a bad assertion if
    // for some reason an unexpected API call is made.
    await delay(100);

    done();
  });

  test('no API call made if phone not entered', async function(assert) {
    assert.expect(1);
    let done = assert.async();

    const requestedUser = getUsersResponse.users[0];

    this.server.get(`/api/v1/users/${requestedUser.id}`, getAdminUserResponse, 200);
    this.server.put(`/api/v1/users/${requestedUser.id}`, () => {
      // This assertion should not run because we are not expecting an API call
      // to be made.
      assert.equal(1, 2);
      done();
    });

    await authenticateSession(adminUserSessionHash);

    await visit(`/users/${requestedUser.id}`);

    await fillIn('input.phone-input', '');
    await click('button.save-button');

    assert.equal(currentURL(), `/users/${requestedUser.id}`);

    // Give the Mirage put request time to respond and throw a bad assertion if
    // for some reason an unexpected API call is made.
    await delay(100);

    done();
  });
});
