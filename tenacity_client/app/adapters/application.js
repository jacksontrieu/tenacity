import DS from 'ember-data';
import TokenAuthorizerMixin from 'ember-simple-auth-token/mixins/token-authorizer';
import ENV from 'tenacity-client/config/environment';

export default DS.JSONAPIAdapter.extend(TokenAuthorizerMixin, {
  host: ENV['api_host_with_port'],
});
