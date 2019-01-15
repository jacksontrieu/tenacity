# Tenacity

A basic user management application built with Ember and Rails JSON API.

## Table of Contents

- [What is Tenacity?](#what-is-tenacity)
  - [Production quality](#production-quality)
- [Demo](#demo)
- [Additional Info for Pavel](#additional-info-for-pavel)
- [Dev Environment Setup](#dev-environment-setup)
  - [Rails configuration](#rails-configuration)
    - [Installing gems](#installing-gems)
    - [Setting up config/application.yml](#setting-up-configapplicationyml)
    - [Creating & migrating the PostgreSQL database](#creating--migrating-the-postgresql-database)
    - [(Optional)Seeding the PostgreSQL database with some test users](#optional-seeding-the-postgresql-database-with-some-test-users)
  - [Ember configuration](#ember-configuration)
    - [Installing npm packages](#installing-npm-packages)
    - [Setting up .env file](#setting-up-env-file)
- [Running the application locally](#running-the-application-locally)
- [Tests](#demo)
  - [Rails](#rails)
  - [Ember](#ember)

## What is Tenacity?

Tenacity is a basic user management application built with Ember and Rails JSON API.

![Tenacity preview](https://user-images.githubusercontent.com/5061912/51108133-35723d00-1845-11e9-9220-8dd427ff1b2f.png)

Tenacity uses the following libraries to provide secure authentication:
- [devise](https://github.com/plataformatec/devise)
- [devise-jwt](https://github.com/waiting-for-dev/devise-jwt)
- [cancancan](https://github.com/CanCanCommunity/cancancan)
- [rolify](https://github.com/RolifyCommunity/rolify)

The Ember front-end app communicates with the Rails API via [JWT tokens](https://jwt.io/).

Rails API routes are formatted to adhere to the [JSON:API spec](https://jsonapi.org/).

Tenacity application users are split into two roles:

| Ability                 | Standard User | Admin User |
| :---                    |     :---:     |    :---:   |
| Edit own profile        |       x       |      x     |
| Change own password     |       x       |      x     |
| View list of all users  |               |      x     |
| Edit any user's profile |               |      x     |

### Production quality
Tenacity is built with "production quality" in mind:
- Comprehensive test suite for both frontend and backend code
- Attention to user experience (e.g. animated loading states, client side error handling, list pagination, long text truncated on table cells)
- Optimised SQL payloads (e.g. SELECT statements limited to columns used in app, indexes on columns appearing in ORDER BY)
- Uses popular, strong, maintained security libraries (devise, cancancan, rolify) for authentication
- Code written using best practices & SOLID principles (e.g. Service Object pattern in backend code via [Rectify gem](https://github.com/andypike/rectify))
- Comprehensive README.md to allow other developers to get setup & contribute fast

## Demo
Here is a working live demo: https://infinite-garden-57955.herokuapp.com/

Please note that the demo is hosted on a free Heroku dyno so may not be booted the first time you access it ([free Heroku web dyno's automatically sleep after 30 minutes if they have not received web traffic](https://devcenter.heroku.com/articles/free-dyno-hours#dyno-sleeping)). Please allow up to 2 minutes after navigating to the demo for the app to boot.

The following two accounts can be used to test the app on Heroku:

| Role          | Email address           | Password    |
|---------------|-------------------------|-------------|
| Admin user    | jackson.trieu@gmail.com | testing123$ |
| Standard user | standard@user.com       | testing123$ |

## Additional Info for Pavel

Note: I have created some issues in the [Issues section of this repo](https://github.com/jacksontrieu/tenacity/issues) that I did not have the time to look at / would be nice to haves in the future.

## Dev Environment Setup

### Rails configuration

#### Installing gems

In a terminal navigate to the root directory and run the following command:

```
bundle install
```

#### Setting up config/application.yml
Create a blank `/config/application.yml` file and add the following settings (replacing all setting values wrapped in `<>` with the settings relevant to your machine):

```yml
DB_USER_DEV: <postgresql user name>
DB_PWD_DEV: <postgresql password>
DB_USER_TEST: <postgresql user name>
DB_PWD_TEST: <postgresql password>
EMBER_FRONTEND_PATH: /frontend
```

In a terminal, create a new secret key that will be used by the [devise-jwt gem](https://github.com/waiting-for-dev/devise-jwt) to encrypt tokens by running the following command:

```
rake secret
# this command will generate a long hash
```

Copy the hash into a new line at the bottom of the `application.yml` file:

```yml
DEVISE_JWT_SECRET_KEY: <copy hash from rake secret here>
```

#### Creating & migrating the PostgreSQL database

In a terminal navigate to the root directory and run the following command:

```
bundle exec rake db:create db:migrate
```

#### (Optional) Seeding the PostgreSQL database with some test users

In a terminal navigate to the root directory and run the following command:

```
bundle exec rake db:seed
```

This will seed the database with 52 test users. The following two users can be used to test the two roles:

| Role          | Email address           | Password    |
|---------------|-------------------------|-------------|
| Admin user    | jackson.trieu@gmail.com | testing123$ |
| Standard user | standard@user.com       | testing123$ |


### Ember configuration

#### Installing npm packages

In a terminal navigate to the `/frontend/` folder and run the following command:

```
npm install
```

#### Setting up .env file
Create a blank `/frontend/.env` file and add the following settings:

```
TENACITY_API_FULL_URL=http://localhost:3000/api/v1
TENACITY_API_HOST=localhost
```

## Running the application locally

After following the steps above in **Dev Environment Setup**, open a terminal at the root directory and run the following command:

```
/bin/rails server
```

NB: You **do not** need to separately run `ember s` in a separate terminal as the gem [ember-cli-rails](https://github.com/thoughtbot/ember-cli-rails) concatenates Rails & Ember into a single process.

## Tests

### Rails
In the root directory, run the following command:

```
rake tests
```

### Ember
In the `/frontend` directory, run the following command:

```
ember test
```
