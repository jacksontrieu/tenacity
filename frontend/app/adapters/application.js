import DS from 'ember-data';
import TokenAuthorizerMixin from 'ember-simple-auth-token/mixins/token-authorizer';
import ENV from 'tenacity-client/config/environment';

export default DS.JSONAPIAdapter.extend(TokenAuthorizerMixin, {
  host: ENV['TENACITY_API_FULL_URL'],
});
