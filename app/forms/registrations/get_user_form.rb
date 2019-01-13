module Forms
  module Registrations
    class GetUserForm < Rectify::Form
      attribute :id, Integer
      validates :id, presence: true, numericality: { greater_than_or_equal_to: 1 }
    end
  end
end
