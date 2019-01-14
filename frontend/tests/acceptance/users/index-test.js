import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { getAdminUserResponse, getUsersResponse } from '../../utils/responses/users';
import { adminUserSessionHash, standardUserSessionHash } from '../../utils/auth';

module('Acceptance | users/index', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('if not logged in visiting /users redirects to root', async function(assert) {
    assert.expect(1);

    await visit('/users');

    assert.equal(currentURL(), '/');
  });

  test('admin user can visit /users', async function(assert) {
    assert.expect(2);

    this.server.get('/api/v1/users', getUsersResponse, 200);

    await authenticateSession(adminUserSessionHash);

    await visit('/users');

    assert.equal(currentURL(), '/users');
    assert.equal(getUsersResponse.users.length, document.querySelectorAll('.lt-row').length);
  });

  test('standard user is redirected to /unauthorized when visiting /users', async function(assert) {
    assert.expect(1);

    await authenticateSession(standardUserSessionHash);

    await visit('/users');

    assert.equal(currentURL(), '/unauthorized');
  });

  test('user data is rendered correctly in table', async function(assert) {
    assert.expect(4);

    this.server.get('/api/v1/users', getUsersResponse, 200);

    await authenticateSession(adminUserSessionHash);

    await visit('/users');
    const firstTableRow = document.querySelector('.ember-light-table tbody tr');
    const firstRowCells = firstTableRow.querySelectorAll('td');

    assert.equal(firstRowCells[1].innerText, getUsersResponse.users[0].email);
    assert.equal(firstRowCells[2].innerText, getUsersResponse.users[0].first_name);
    assert.equal(firstRowCells[3].innerText, getUsersResponse.users[0].last_name);
    assert.equal(firstRowCells[4].innerText, getUsersResponse.users[0].phone);
  });

  test('clicking on an edit icon redirects to /users/:id', async function(assert) {
    assert.expect(1);

    this.server.get('/api/v1/users', getUsersResponse, 200);
    this.server.get('/api/v1/users/1', getAdminUserResponse, 200);

    await authenticateSession(adminUserSessionHash);

    await visit('/users');
    const firstEditLink = document.querySelector('.cell-edit-icon a');
    await click(firstEditLink);

    assert.equal(currentURL(), `/users/${getUsersResponse.users[0].id}`);
  });
});
