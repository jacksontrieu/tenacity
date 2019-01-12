Rails.application.routes.draw do
  devise_scope :user do
    get 'users/details' => 'user/registrations#details'
    get 'users' => 'user/registrations#index'
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
