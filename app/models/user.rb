class User < ApplicationRecord
  include ActiveModel::Validations

  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: JWTBlacklist

  after_create :assign_default_role

  has_many :users_roles

  # Require a minimum entropy of 18.
  validates :password, password_strength: true

  def assign_default_role
    self.add_role(:standard_user) if self.roles.blank?
  end

  def ability
    @ability ||= Ability.new(self)
  end
  delegate :can?, :cannot?, :to => :ability

  # Determines if the user is allowed to read/update a specified user.
  def can_access_user?(user_to_access)
    return self.id == user_to_access.id ||
           self.has_role?(:admin_user)
  end

  def name
    result = (first_name || '').strip + ' ' + (last_name || '').strip
    return result.strip
  end

  def highest_role
    return :admin_user if self.roles.any? { |r| r.name == :admin_user.to_s }
    return :standard_user
  end
end
