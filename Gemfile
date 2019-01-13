source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.5.3'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.2.2'

# Use Postgresql as the database for Active Record.
gem 'pg', '~> 1.1.3'

# Use Puma as the app server
gem 'puma', '~> 3.11'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
# gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use ActiveStorage variant
# gem 'mini_magick', '~> 4.8'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

# Use Devise for authentication.
gem 'devise', '~> 4.5.0'

# The Ember front-end will communicate with devise using JSON Web Tokens.
gem 'devise-jwt', '~> 0.5.8'

gem 'responders', '~> 2.4.0'

# Entropy-based password strength checker used to enforce user passwords.
gem 'strong_password', '~> 0.0.6'

# Role management library with resource scoping.
gem 'rolify', '~> 5.1.0'

# Authorization library that sets up roles for who can/can't perform certain
# actions.
gem 'cancancan', '~> 2.0'

# Adds pagination methods to ActiveRecord.
gem 'kaminari', '~> 1.1.1'

# Rails app configuration using ENV and a centralised single YAML file at:
# config/application.yml.
gem 'figaro', '~> 1.1.1'

# Reduces boot times through caching; required in config/boot.rb
# gem 'bootsnap', '>= 1.1.0', require: false

# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
gem 'rack-cors', '~> 0.4.1', require: 'rack/cors'

# Provides a high-level architecture for rails apps, providing abstractions
# prescribing how to implement and structure business logic.
gem 'rectify', '0.13.0'

# Helps generate fake data.
gem 'faker', :git => 'https://github.com/stympy/faker.git', :branch => 'master'

gem 'ember-cli-rails', '~> 0.10.0'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end

group :development do
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

group :test do
  gem 'shoulda', '~> 3.6.0'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# No longer needed as per:
# https://devcenter.heroku.com/articles/getting-started-with-rails5#heroku-gems
# gem 'rails_12factor', group: [:staging, :production]

gem 'rails_12factor', group: [:staging, :production]
