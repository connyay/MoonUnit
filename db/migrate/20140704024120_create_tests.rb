class CreateTests < ActiveRecord::Migration
  def change
    create_table :tests do |t|
      t.string :class_name
      t.string :name
      t.text :log

      t.timestamps
    end
  end
end
