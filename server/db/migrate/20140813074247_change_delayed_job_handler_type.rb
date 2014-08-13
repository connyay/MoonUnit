class ChangeDelayedJobHandlerType < ActiveRecord::Migration
  def up
    change_column :delayed_jobs, :handler, :mediumtext
  end

  def down
    change_column :delayed_jobs, :handler, :text
  end
end
