class Ability
  include CanCan::Ability

  def initialize(user)
    # Admin users can see all registered users and update any details.
    if user.has_role?(:admin_user)
      can :manage, :all_users
    end
  end
end
