Rails.application.routes.draw do
  # Configure Rails to route requests to the frontend Ember application.
  mount_ember_app :frontend, to: '/'

  scope '/api' do
    scope '/v1' do
      devise_scope :user do
        post 'login' => 'user/sessions#create'
        delete 'logout' => 'user/sessions#destroy'

        get 'users/:id' => 'user/registrations#show'
        get 'users' => 'user/registrations#index'
        patch 'users' => 'user/registrations#update'
        patch 'users/:id' => 'user/registrations#update'
        post 'users' => 'user/registrations#create'
        put 'users' => 'user/registrations#update'
        put 'users/:id' => 'user/registrations#update'
      end

      patch 'password' => 'password#update'
      put 'password' => 'password#update'
    end
  end

  devise_for :users,
             skip: %w[passwords registrations sessions],
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

end
