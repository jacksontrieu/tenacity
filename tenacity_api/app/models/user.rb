class User < ApplicationRecord
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: JWTBlacklist

  after_create :assign_default_role

  def assign_default_role
    self.add_role(:standard_user) if self.roles.blank?
  end

  def highest_role
    return :admin_user if self.roles.any? { |r| r.name == :admin_user.to_s }
    return :standard_user
  end
end
