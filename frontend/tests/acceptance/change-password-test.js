import { module, test } from 'qunit';
import { click, fillIn, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { adminUserSessionHash } from '../utils/auth';
import { delay } from '../utils/helpers';

module('Acceptance | change password', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('if not logged in visiting /change-password redirects to root', async function(assert) {
    assert.expect(1);

    await visit('/change-password');

    assert.equal(currentURL(), '/');
  });

  test('if logged in visiting /change-password renders change-password page', async function(assert) {
    assert.expect(1);

    this.server.get('/api/v1/passwords/1', (schema) => {
      return schema.passwords.find(1);
    });

    await authenticateSession(adminUserSessionHash);
    await visit('/change-password');

    assert.equal(currentURL(), '/change-password');
  });

  test('redirected to /dashboard if change password API call is successful', async function(assert) {
    assert.expect(1);

    this.server.get('/api/v1/passwords/1', (schema) => {
      return schema.passwords.find(1);
    });
    this.server.patch('/api/v1/passwords/1', (schema) => {
      return schema.passwords.find(1);
    });
    this.server.put('/api/v1/passwords/1', (schema) => {
      return schema.passwords.find(1);
    });

    await authenticateSession(adminUserSessionHash);
    await visit('/change-password');
    await fillIn('input.current-password-input', 'testing123$');
    await fillIn('input.new-password-input', 'newtesting123$');
    await fillIn('input.confirm-password-input', 'newtesting123$');
    await click('button.save-button');

    assert.equal(currentURL(), '/dashboard');
  });

  test("error toast shown and no PATCH/PUT API call made if new password doesn't match", async function(assert) {
    assert.expect(2);

    this.server.get('/api/v1/passwords/1', (schema) => {
      return schema.passwords.find(1);
    });

    await authenticateSession(adminUserSessionHash);
    await visit('/change-password');
    await fillIn('input.current-password-input', 'testing123$');
    await fillIn('input.new-password-input', 'NOPE123%$^');
    await fillIn('input.confirm-password-input', 'YEP123%$^');
    await click('button.save-button');

    let waitCount = 0;
    let toastContainer = null;
    while (!toastContainer && waitCount < 5000) {
      toastContainer = document.querySelector('#toast-container')
      await delay(25);
      waitCount += 25;
    }

    assert.dom('#toast-container', document).includesText("The new password doesn't match.");

    assert.equal(currentURL(), '/change-password');
  });

  test('no PATCH/PUT API call made if user does not enter current password', async function(assert) {
    assert.expect(1);

    this.server.get('/api/v1/passwords/1', (schema) => {
      return schema.passwords.find(1);
    });

    await authenticateSession(adminUserSessionHash);
    await visit('/change-password');
    await fillIn('input.new-password-input', 'xesting123$$');
    await fillIn('input.confirm-password-input', 'xesting123$$');
    await click('button.save-button');

    assert.equal(currentURL(), '/change-password');
  });

  test('no PATCH/PUT API call made if user does not enter new password', async function(assert) {
    assert.expect(1);

    this.server.get('/api/v1/passwords/1', (schema) => {
      return schema.passwords.find(1);
    });

    await authenticateSession(adminUserSessionHash);
    await visit('/change-password');
    await fillIn('input.current-password-input', 'xesting123$$');
    await fillIn('input.confirm-password-input', 'xesting123$$');
    await click('button.save-button');

    assert.equal(currentURL(), '/change-password');
  });

  test('no PATCH/PUT API call made if user does not enter confirm password', async function(assert) {
    assert.expect(1);

    this.server.get('/api/v1/passwords/1', (schema) => {
      return schema.passwords.find(1);
    });

    await authenticateSession(adminUserSessionHash);
    await visit('/change-password');
    await fillIn('input.current-password-input', 'xesting123$$');
    await fillIn('input.new-password-input', 'xesting123$$');
    await click('button.save-button');

    assert.equal(currentURL(), '/change-password');
  });
});
