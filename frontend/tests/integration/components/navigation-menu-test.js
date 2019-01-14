import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

const findDashboardItem = (liArray) => {
  return liArray.find(li => li.querySelector('a.dashboard-nav-item'));
};

const findProfileItem = (liArray) => {
  return liArray.find(li => li.querySelector('a.profile-nav-item'));
};

const findManageUsersItem = (liArray) => {
  return liArray.find(li => li.querySelector('a.users-nav-item'));
};
const findLogoutItem = (liArray) => {
  return liArray.find(li => li.querySelector('a.logout-nav-item'));
};

module('Integration | Component | navigation-menu', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders and shows admin items', async function(assert) {
    assert.expect(5);

    // Need to turn on the router for this test because this component uses a
    // link-to helper which requries a router, as per:
    // https://stackoverflow.com/a/53735725
    this.owner.lookup('router:main').setupRouter();

    this.set('showAdminNavigationItems', true);

    await render(hbs`{{navigation-menu showAdminNavigationItems=showAdminNavigationItems}}`);

    const liItems = this.element.querySelectorAll('li');
    const liArray = Array.prototype.slice.call(liItems);

    assert.equal(liArray.length, 4, 'Renders all nav items including admin items.');

    assert.ok(findDashboardItem(liArray), 'Dashboard menu item is rendered.');
    assert.ok(findProfileItem(liArray), 'Profile menu item is rendered.');
    assert.ok(findManageUsersItem(liArray), 'Manage Users menu item is rendered.');
    assert.ok(findLogoutItem(liArray), 'Logout menu item is rendered.');
  });

  test('it renders and hides admin items', async function(assert) {
    assert.expect(5);

    // Need to turn on the router for this test because this component uses a
    // link-to helper which requries a router, as per:
    // https://stackoverflow.com/a/53735725
    this.owner.lookup('router:main').setupRouter();

    this.set('showAdminNavigationItems', false);

    await render(hbs`{{navigation-menu showAdminNavigationItems=showAdminNavigationItems}}`);

    const liItems = this.element.querySelectorAll('li');
    const liArray = Array.prototype.slice.call(liItems);

    assert.equal(liArray.length, 3, 'Renders non-admin nav items.');

    assert.ok(findDashboardItem(liArray), 'Dashboard menu item is rendered.');
    assert.ok(findProfileItem(liArray), 'Profile menu item is rendered.');
    assert.notOk(findManageUsersItem(liArray), 'Manage Users menu item is not rendered.');
    assert.ok(findLogoutItem(liArray), 'Logout menu item is rendered.');
  });
});
