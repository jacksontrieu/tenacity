module Commands
  module Sessions
    class BlacklistJwi < Rectify::Command
      def initialize(authorization_header)
        @authorization_header = authorization_header
      end

      def call
        return broadcast(:invalid) if @authorization_header.blank?

        begin
          base64_claims = Base64.decode64(@authorization_header.split('.')[1])
          claims = JSON.parse(base64_claims)
          jti = claims['jti']

          unless JWTBlacklist.find_by(jti: jti).present?
            JWTBlacklist.create!(
              jti: jti
            )
          end

          return broadcast(:ok)
        rescue
          return broadcast(:invalid)
        end
      end
    end
  end
end
