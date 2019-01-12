'use strict';

module.exports = function(environment) {
  let ENV = {
    contentSecurityPolicy: {
      'connect-src': "*"
    },
    modulePrefix: 'tenacity-client',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  ENV['ember-simple-auth'] = {
    routeAfterAuthentication: 'dashboard',
    routeIfAlreadyAuthenticated: 'dashboard',
    authenticationRoute: '/'
  };

  ENV['api_host'] = 'localhost';
  ENV['api_host_with_port'] = 'http://localhost:3000';

  ENV['ember-simple-auth-token'] = {
    serverTokenEndpoint: ENV['api_host_with_port'] + '/login', // Server endpoint to send authenticate request
    tokenPropertyName: 'token', // Key in server response that contains the access token
    headers: {},
    tokenDataPropertyName: 'tokenData', // Key in session to store token data
    refreshAccessTokens: true, // Enables access token refreshing
    tokenExpirationInvalidateSession: true, // Enables session invalidation on token expiration
    serverTokenRefreshEndpoint: '/api/token-refresh/', // Server endpoint to send refresh request
    refreshTokenPropertyName: 'refresh_token', // Key in server response that contains the refresh token
    tokenExpireName: 'exp', // Field containing token expiration
    refreshLeeway: 600 // Amount of time to send refresh request before token expiration
  };

  return ENV;
};
