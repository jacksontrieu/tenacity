module Forms
  module Registrations
    class GetUsersForm < Rectify::Form
      attribute :page_number, Integer
      attribute :page_size, Integer

      validates :page_number, presence: true, numericality: { greater_than_or_equal_to: 1 }
      validates :page_size, presence: true, numericality: { greater_than_or_equal_to: 1 }
    end
  end
end
