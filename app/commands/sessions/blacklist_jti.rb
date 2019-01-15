module Commands
  module Sessions
    class BlacklistJti < Rectify::Command
      def initialize(authorization_header, jti_decoder = nil)
        @authorization_header = authorization_header
        @jti_decoder = jti_decoder || Decoders::JwiDecoder.new
      end

      def call
        return broadcast(:invalid) if @authorization_header.blank?

        jti = @jti_decoder.get_claim(@authorization_header)

        return broadcast(:invalid) if jti.blank?

        unless JwtBlacklist.find_by(jti: jti).present?
          JwtBlacklist.create!(
            jti: jti
          )
        end

        return broadcast(:ok)
      end
    end
  end
end
