import Component from '@ember/component';
import { computed } from '@ember/object';

const calculatePageCount = (totalCount, pageSize) => {
  return Math.ceil(totalCount / pageSize);
};

export default Component.extend({
  pageCount: computed('pageNumber', 'pageSize', 'totalCount', function() {
    return calculatePageCount(this.get('totalCount'), this.get('pageSize'));
  }),
  canGoBackward: computed('pageNumber', function() {
    return this.get('pageNumber') > 1;
  }),
  canGoForward: computed('pageNumber', 'pageSize', 'totalCount', function() {
    const pageCount = calculatePageCount(this.get('totalCount'), this.get('pageSize'));
    return this.get('pageNumber') < pageCount;
  }),
  previousPageNumber: computed('pageNumber', 'pageSize', 'totalCount', function() {
    const pageCount = calculatePageCount(this.get('totalCount'), this.get('pageSize'));

    if (this.get('pageNumber') > pageCount) {
      return pageCount;
    }
    else {
      return this.get('pageNumber') - 1;
    }
  }),
  nextPageNumber: computed('pageNumber', function() {
    if (this.get('pageNumber') < 1) {
      return 1;
    }
    else {
      return this.get('pageNumber') + 1
    }
  })
});
