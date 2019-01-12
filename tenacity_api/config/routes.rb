Rails.application.routes.draw do
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
