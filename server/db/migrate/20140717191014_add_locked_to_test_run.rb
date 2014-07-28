class AddLockedToTestRun < ActiveRecord::Migration
  def change
    add_column :test_runs, :locked, :boolean, :default => false
  end
end
