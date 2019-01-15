// Overriding the defaults in ember-simple-auth-token to support a JSON:API
// spec structured /login endpoint, that requires a JSON:API spec formatted
// POST body, and returns a JSON:API spec formatted response body.

import Token from 'ember-simple-auth-token/authenticators/token';
import fetch from 'fetch';
import { assign } from '@ember/polyfills';
import { Promise } from 'rsvp';

const deserializeJsonApiData = (responseBody) => {
  return  {
    id: responseBody.data.id,
    email: responseBody.data.attributes.email,
    name: responseBody.data.attributes.name,
    token: responseBody.data.attributes.token,
    role: responseBody.data.attributes.role
  };
};

export default Token.extend({
  authenticate(credentials, headers) {
    return this.makeRequest(this.serverTokenEndpoint, credentials, assign({}, this.headers, headers))
      .then(response => response.json);
  },
  getAuthenticateData(credentials) {
    const authentication = {
      auth: {
        [this.passwordField]: credentials.password,
        [this.identificationField]: credentials.identification
      }
    };

    return authentication;
  },
  makeRequest(url, data, headers) {

    return new Promise((resolve, reject) => {
      return fetch(url, {
        method: 'POST',
        headers: assign({
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        }, headers),
        body: JSON.stringify(data)
      }).then(response => {
        const res = {
          statusText: response.statusText,
          status: response.status,
          headers: response.headers
        };

        response.text().then(text => {
          res.text = text;
          try {
            res.json = deserializeJsonApiData(JSON.parse(text))
          } catch (e) {
            return reject(res);
          }

          if (response.ok) {
            resolve(res);
          } else {
            reject(res);
          }
        }).catch(() => reject(res));
      }).catch(reject);
    });
  }
});
