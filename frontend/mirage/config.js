import Mirage from 'ember-cli-mirage';

export default function() {
  this.urlPrefix = 'http://localhost:3000';

  /////////////////////////////////////////////////////////////////////////////
  // Login: /api/v1/login /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  this.post('/api/v1/login', (db, request) => {
    let requestPayload = {};
    if (request.requestBody) {
      requestPayload = JSON.parse(request.requestBody);
    }

    // Invalid user will not be authorized.
    if (requestPayload.user.email == 'invalid@user.com') {
      return new Mirage.Response(401);
    }

    const headers = {
      'Authorization': 'THIS_IS_A_TOKEN'
    };

    const body = {
      id: 1,
      email: 'admin@user.com',
      name: 'Admin User',
      token: 'THIS_IS_A_TOKEN',
      role: 'admin_user'
    };

    return new Mirage.Response(200, headers, body);
  });

  /////////////////////////////////////////////////////////////////////////////
  // Signup: /api/v1/users ////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  this.post('/api/v1/users', (db, request) => {
    let requestPayload = {};
    if (request.requestBody) {
      requestPayload = JSON.parse(request.requestBody);
    }

    // Missing fields will return 400 response..
    if (!requestPayload.user.email ||
        !requestPayload.user.first_name ||
        !requestPayload.user.last_name ||
        !requestPayload.user.phone ||
        !requestPayload.user.password ||
        !requestPayload.user.confirm_password) {
      return new Mirage.Response(400,);
    }

    // Mimic the error that the devise signup controller action will return if
    // a user already exists with the specified email address .
    if (requestPayload.user.email == 'duplicate@user.com') {
      return new Mirage.Response(400, null, {
        errors: {
          email: 'Email duplicate@user.com has already been taken.'
        }
      });
    }

    const headers = {
      'Authorization': 'THIS_IS_A_TOKEN'
    };

    const body = {
      id: 1,
      email: 'admin@user.com',
      name: 'Admin User',
      token: 'THIS_IS_A_TOKEN',
      role: 'admin_user'
    };

    return new Mirage.Response(200, headers, body);
  });
}
