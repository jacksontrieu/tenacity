module Commands
  module Registrations
    class CreateUser < Rectify::Command
      def initialize(form)
        @form = form
      end

      def call
        return broadcast(:invalid, @form.errors) if @form.invalid?

        user = User.new(
          email: @form.email,
          first_name: @form.first_name,
          last_name: @form.last_name,
          phone: @form.phone,
          password: @form.password
        )
        user.save

        return broadcast(:invalid, user.errors) if user.invalid?

        return broadcast(:ok, user)
      end
    end
  end
end
