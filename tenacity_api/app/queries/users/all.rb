module Queries
  module Users
    class All < Queries::QueryBase
      def initialize(params = {})
        @page_number = params[:page_number] || 1
        @page_size = params[:page_size] || 20
      end

      def data
        return User.order(:first_name, :last_name).limit(@page_size).page(@page_number)
      end
    end
  end
end
