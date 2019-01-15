require 'test_helper'

module Commands
  module Sessions
    class BlacklistJtiTest < ActiveSupport::TestCase
      def setup
        @existing_record = jwt_blacklists(:first_record)
      end

      context '#call' do
        should 'Broadcast :ok if valid authorization_header & jti has not previously been blacklisted' do
          new_jti = 'new_jti'
          assert_equal 0, JwtBlacklist.where(jti: new_jti).count

          mock_decoder = mock()
          mock_decoder.stubs(:nil?).returns(false)
          mock_decoder.stubs(:get_claim).returns(new_jti)

          is_ok = false
          is_invalid = false

          assert_difference -> { JwtBlacklist.all.count }, 1 do
            ::Commands::Sessions::BlacklistJti.call('abc', mock_decoder) do
              on(:ok) do
                is_ok = true
              end

              on(:invalid) do
                is_invalid = false
              end
            end
          end

          assert is_ok
          assert_not is_invalid
          assert_equal 1, ::JwtBlacklist.where(jti: new_jti).count
        end

        should 'Broadcast :ok if valid authorization_header & jti has previously been blacklisted' do
          mock_decoder = mock()
          mock_decoder.stubs(:nil?).returns(false)
          mock_decoder.stubs(:get_claim).returns(@existing_record.jti)

          is_ok = false
          is_invalid = false

          assert_difference -> { ::JwtBlacklist.all.count }, 0 do
            ::Commands::Sessions::BlacklistJti.call('abc', mock_decoder) do
              on(:ok) do
                is_ok = true
              end

              on(:invalid) do
                is_invalid = false
              end
            end
          end

          assert is_ok
          assert_not is_invalid
          assert_equal 1, JwtBlacklist.where(jti: @existing_record.jti).count
        end
      end
    end
  end
end
