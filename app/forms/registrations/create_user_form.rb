module Forms
  module Registrations
    class CreateUserForm < Rectify::Form
      attribute :email, String
      attribute :first_name, String
      attribute :last_name,  String
      attribute :phone,  String
      attribute :password,  String

      validates :email, presence: true, length: { maximum: 150 }
      validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
      validates :first_name, presence: true, length: { maximum: 150 }
      validates :last_name, presence: true, length: { maximum: 150 }
      validates :phone, presence: true, length: { maximum: 100 }
      validates :password, presence: true, length: { maximum: 200 }
      validate :password_complexity

      private

      def password_complexity
        # Regexp extracted from https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
        return if @password =~ /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,70}$/

        errors.add :password, 'Complexity requirement not met. Length should be 8-70 characters and include: 1 lowercase, 1 digit and 1 special character'
      end
    end
  end
end
