module Forms
  module Passwords
    class UpdatePasswordForm < Rectify::Form
      attribute :id, Integer
      attribute :current_password, String
      attribute :new_password,  String
      attribute :confirm_password,  String

      validates :id, presence: true, numericality: { greater_than_or_equal_to: 1 }
      validates :current_password, presence: true
      validates :new_password, presence: true
      validates :confirm_password, presence: true
      validate :password_complexity

      private

      def password_complexity
        # Regexp extracted from https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
        return if @new_password =~ /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,70}$/

        errors.add :new_password, 'Complexity requirement not met. Length should be 8-70 characters and include: 1 lowercase, 1 digit and 1 special character'
      end
    end
  end
end
