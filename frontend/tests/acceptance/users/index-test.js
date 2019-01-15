import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';
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

    this.server.get('/api/v1/users', (schema) => {
      return schema.users.all();
    });

    await authenticateSession(adminUserSessionHash);
    await visit('/users');

    assert.equal(currentURL(), '/users');
    assert.equal(this.server.db.users.length, document.querySelectorAll('.lt-row').length);
  });

  test('standard user is redirected to /unauthorized when visiting /users', async function(assert) {
    assert.expect(1);

    await authenticateSession(standardUserSessionHash);
    await visit('/users');

    assert.equal(currentURL(), '/unauthorized');
  });

  test('user data is rendered correctly in table', async function(assert) {
    assert.expect(4);

    this.server.get('/api/v1/users', (schema) => {
      return schema.users.all();
    });

    await authenticateSession(adminUserSessionHash);
    await visit('/users');

    const firstTableRow = document.querySelector('.ember-light-table tbody tr');
    const firstRowCells = firstTableRow.querySelectorAll('td');
    const expectedFirstUser = this.server.db.users.find(1);
    assert.equal(firstRowCells[1].innerText, expectedFirstUser.email);
    assert.equal(firstRowCells[2].innerText, expectedFirstUser.first_name);
    assert.equal(firstRowCells[3].innerText, expectedFirstUser.last_name);
    assert.equal(firstRowCells[4].innerText, expectedFirstUser.phone);
  });

  test('clicking on an edit icon redirects to /users/:id', async function(assert) {
    assert.expect(1);

    this.server.get(`/api/v1/users/1`, (schema) => {
      return schema.users.find(1);
    });
    this.server.get('/api/v1/users', (schema) => {
      return schema.users.all();
    });

    await authenticateSession(adminUserSessionHash);
    await visit('/users');

    const firstEditLink = document.querySelector('.cell-edit-icon a');
    await click(firstEditLink);

    const expectedFirstUser = this.server.db.users.find(1);
    assert.equal(currentURL(), `/users/${expectedFirstUser.id}`);
  });
});
