import Controller from '@ember/controller';
import { computed } from '@ember/object';
import Table from 'ember-light-table';

export default Controller.extend({
  columns: computed(function() {
    return [{
      cellComponent: 'cell-edit-icon',
      valuePath: 'id',
      width: '80px'
    }, {
      label: 'Email Address',
      valuePath: 'email',
      sortable: false
    }, {
      label: 'First Name',
      valuePath: 'first_name',
      sortable: false
    }, {
      label: 'Last Name',
      valuePath: 'last_name',
      sortable: false
    }, {
      label: 'Phone',
      valuePath: 'phone',
      sortable: false
    }];
  }),

  pageNumber: 1,
  pageSize: 25,
  totalCount: 0,

  table: computed('model', function() {
   return new Table(this.get('columns'), this.get('model').users, { enableSync: true });
  })
});
