module Decoders
  class JwiDecoder
    def get_claim(authorization_header)
      base64_claims = Base64.decode64(@authorization_header.split('.')[1])
      claims = JSON.parse(base64_claims)
      jti = claims['jti']

      return jti
    rescue
      return nil
    end
  end
end
