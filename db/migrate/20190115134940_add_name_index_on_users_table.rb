class AddNameIndexOnUsersTable < ActiveRecord::Migration[5.2]
  def change
    add_index :users, %w[first_name last_name]
  end
end
