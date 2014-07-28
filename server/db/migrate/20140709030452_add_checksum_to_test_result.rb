class AddChecksumToTestResult < ActiveRecord::Migration
  def change
    add_column :test_results, :checksum, :string
  end
end
