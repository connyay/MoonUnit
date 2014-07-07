class CreateTestResults < ActiveRecord::Migration
  def change
    create_table :test_results do |t|
      t.references :test, index: true
      t.references :test_run, index: true
      t.string :result
      t.string :log
      t.float :time
      t.timestamps
    end
  end
end
