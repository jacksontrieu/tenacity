Rails.application.routes.draw do
  # Configure Rails to route requests to the frontend Ember application.
  mount_ember_app :frontend, to: '/'

  devise_scope :user do
    get 'users/:id' => 'user/registrations#show'
    get 'users' => 'user/registrations#index'
    patch 'users/:id' => 'user/registrations#update'
    put 'users/:id' => 'user/registrations#update'
  end

  devise_for :users,
             defaults: { format: :json },
             path: '',
             path_names: {
               sign_in: 'login',
               sign_out: 'logout',
               registration: 'users'
             },
             controllers: {
               sessions: 'user/sessions',
               registrations: 'user/registrations',
               passwords: 'user/passwords'
             }

  put 'password' => 'password#update'
end
