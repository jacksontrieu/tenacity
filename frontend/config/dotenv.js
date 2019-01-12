module.exports = function(env) {
  return {
    clientAllowedKeys: [
      'TENACITY_API_HOST',
      'TENACITY_API_FULL_URL'
    ],
    // Fail build when there is missing any of clientAllowedKeys environment variables.
    // By default false.
    failOnMissingKey: false,
  };
};
