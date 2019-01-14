module Forms
  module Passwords
    class UpdatePasswordForm < Rectify::Form
      include ActiveModel::Validations

      attribute :current_password, String
      attribute :new_password,  String
      attribute :confirm_password,  String

      validates :current_password, presence: true
      validates :new_password, presence: true, password_strength: true
      validates :confirm_password, presence: true, password_strength: true
    end
  end
end
