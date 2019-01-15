import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { adminUserSessionHash, standardUserSessionHash } from '../utils/auth';

module('Acceptance | dashboard', function(hooks) {
  setupApplicationTest(hooks);

  test('if not logged in visiting /dashboard redirects to root', async function(assert) {
    assert.expect(1);

    await visit('/dashboard');

    assert.equal(currentURL(), '/');
  });

  test('if logged in visiting /dashboard displays name and role', async function(assert) {
    assert.expect(3);

    await authenticateSession(adminUserSessionHash);
    await visit('/dashboard');

    assert.equal(currentURL(), '/dashboard');
    assert.equal('Admin User', this.element.querySelector('span.user-name').textContent);
    assert.equal('admin_user', this.element.querySelector('span.user-role-name').textContent);
  });

  test('if admin user logged in ability to manage all users ability is shown', async function(assert) {
    assert.expect(4);

    await authenticateSession(adminUserSessionHash);
    await visit('/dashboard');

    assert.equal(currentURL(), '/dashboard');
    assert.ok(this.element.querySelector('a.ability-edit-profile'), 'Edit profile ability shown.');
    assert.ok(this.element.querySelector('a.ability-change-password'), 'Change password ability shown.');
    assert.ok(this.element.querySelector('a.ability-manage-all-users'), 'Manage all users ability shown.');
  });

  test('if standard user logged in ability to manage all users ability is shown', async function(assert) {
    assert.expect(4);

    await authenticateSession(standardUserSessionHash);
    await visit('/dashboard');

    assert.equal(currentURL(), '/dashboard');
    assert.ok(this.element.querySelector('a.ability-edit-profile'), 'Edit profile ability shown.');
    assert.ok(this.element.querySelector('a.ability-change-password'), 'Change password ability shown.');
    assert.notOk(this.element.querySelector('a.ability-manage-all-users'), 'Manage all users ability shown.');
  });
});
