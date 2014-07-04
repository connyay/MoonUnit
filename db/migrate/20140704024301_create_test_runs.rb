class CreateTestRuns < ActiveRecord::Migration
  def change
    create_table :test_runs do |t|
      t.string :build_id
      t.timestamps
    end
  end
end
