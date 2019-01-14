class User < ApplicationRecord
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: JWTBlacklist

  after_create :assign_default_role

  has_many :users_roles

  validate :password_complexity

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

  private

  def password_complexity
    # Regexp extracted from https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
    return if password.blank? || password =~ /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,70}$/

    errors.add :password, 'Complexity requirement not met. Length should be 8-70 characters and include: 1 uppercase, 1 lowercase, 1 digit and 1 special character'
  end
end
