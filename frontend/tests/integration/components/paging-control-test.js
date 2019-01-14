import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | paging-control', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders correctly on the first page', async function(assert) {
    assert.expect(4);

    // Need to turn on the router for this test because this component uses a
    // link-to helper which requries a router, as per:
    // https://stackoverflow.com/a/53735725
    this.owner.lookup('router:main').setupRouter();

    this.set('pageNumber', 1);
    this.set('pageSize', 30)
    this.set('targetRoute', 'users');
    this.set('totalCount', 100);

    await render(hbs`
      {{paging-control targetRoute="users"
                       pageNumber=pageNumber
                       pageSize=pageSize
                       totalCount=totalCount}}
    `);

    assert.equal(
      this.element.querySelector('.current-page-number').innerText,
      '1',
      'Displays the correct page number'
    );

    assert.equal(
      this.element.querySelector('.page-count').innerText,
      '4',
      'Displays the correct page count'
    );

    assert.notOk(
      this.element.querySelector('a.previous-link'),
      'Does not render the previous-link'
    );

    assert.equal(
      this.element.querySelector('a.next-link').getAttribute('href'),
      '/users?pageNumber=2&pageSize=30',
      'Renders the correct next-link href'
    );
  });

  test('it renders correctly on the last page', async function(assert) {
    assert.expect(4);

    // Need to turn on the router for this test because this component uses a
    // link-to helper which requries a router, as per:
    // https://stackoverflow.com/a/53735725
    this.owner.lookup('router:main').setupRouter();

    this.set('pageNumber', 4);
    this.set('pageSize', 30)
    this.set('targetRoute', 'users');
    this.set('totalCount', 100);

    await render(hbs`
      {{paging-control targetRoute="users"
                       pageNumber=pageNumber
                       pageSize=pageSize
                       totalCount=totalCount}}
    `);

    assert.equal(
      this.element.querySelector('.current-page-number').innerText,
      '4',
      'Displays the correct page number'
    );

    assert.equal(
      this.element.querySelector('.page-count').innerText,
      '4',
      'Displays the correct page count'
    );

    assert.equal(
      this.element.querySelector('a.previous-link').getAttribute('href'),
      '/users?pageNumber=3&pageSize=30',
      'Renders the correct previous-link href'
    );

    assert.notOk(
      this.element.querySelector('a.next-link'),
      'Does not render the next-link'
    );
  });

  test('it renders correctly on a page in the middle', async function(assert) {
    assert.expect(4);

    // Need to turn on the router for this test because this component uses a
    // link-to helper which requries a router, as per:
    // https://stackoverflow.com/a/53735725
    this.owner.lookup('router:main').setupRouter();

    this.set('pageNumber', 2);
    this.set('pageSize', 30)
    this.set('targetRoute', 'users');
    this.set('totalCount', 100);

    await render(hbs`
      {{paging-control targetRoute="users"
                       pageNumber=pageNumber
                       pageSize=pageSize
                       totalCount=totalCount}}
    `);

    assert.equal(
      this.element.querySelector('.current-page-number').innerText,
      '2',
      'Displays the correct page number'
    );

    assert.equal(
      this.element.querySelector('.page-count').innerText,
      '4',
      'Displays the correct page count'
    );

    assert.equal(
      this.element.querySelector('a.previous-link').getAttribute('href'),
      '/users?pageSize=30',
      'Renders the correct previous-link href'
    );

    assert.equal(
      this.element.querySelector('a.next-link').getAttribute('href'),
      '/users?pageNumber=3&pageSize=30',
      'Renders the correct next-link href'
    );
  });
});
