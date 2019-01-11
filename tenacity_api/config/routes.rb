Rails.application.routes.draw do
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
               registrations: 'user/registrations'
             }

   devise_scope :user do
    get 'users' => 'user/registrations#index'
  end
end
