class CreateTests < ActiveRecord::Migration
  def change
    create_table :tests do |t|
      t.string :package
      t.string :class_name
      t.string :name

      t.timestamps
    end
  end
end
