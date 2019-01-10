// import DS from 'ember-data';
// import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

// export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
//   // Use the Devise Adapter on all Ember Data requests.
//   authorizer: 'authorizer:devise'
// });


import DS from 'ember-data';
import TokenAuthorizerMixin from 'ember-simple-auth-token/mixins/token-authorizer';

export default DS.JSONAPIAdapter.extend(TokenAuthorizerMixin);
