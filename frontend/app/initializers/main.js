import { registerDeprecationHandler } from '@ember/debug';

export function initialize() {
  registerDeprecationHandler((message, options, next) => {
    if (message.indexOf('You attempted to remove a function listener which did not exist on the instance') > -1) {
      return;
    }
    else if (message.indexOf('Use of `merge` has been deprecated.') > -1) {
      return;
    }
    else if (message.indexOf('using `new` with EmberObject has been deprecated') > -1) {
      return;
    }
    else if (message.indexOf('You called <tenacity-client@component:lt-body') > -1 &&
             message.indexOf('.sendAction("onRowClick")')) {
      return;
    } else {
      next(message, options);
    }
  });
}
