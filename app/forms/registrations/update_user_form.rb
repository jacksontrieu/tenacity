module Forms
  module Registrations
    class UpdateUserForm < Rectify::Form
      attribute :id, Integer
      attribute :first_name, String
      attribute :last_name,  String
      attribute :phone,  String

      validates :first_name, presence: true, length: { maximum: 150 }
      validates :last_name, presence: true, length: { maximum: 150 }
      validates :phone, presence: true, length: { maximum: 100 }
    end
  end
end
