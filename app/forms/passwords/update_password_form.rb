module Forms
  module Passwords
    class UpdatePasswordForm < Rectify::Form
      attribute :current_password, String
      attribute :new_password,  String
      attribute :confirm_password,  String

      validates :current_password, presence: true
      validates :new_password, presence: true
      validates :confirm_password, presence: true
    end
  end
end
