# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140704024301) do

  create_table "test_results", force: true do |t|
    t.integer  "test_id"
    t.integer  "test_run_id"
    t.string   "result"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "test_results", ["test_id"], name: "index_test_results_on_test_id"
  add_index "test_results", ["test_run_id"], name: "index_test_results_on_test_run_id"

  create_table "test_runs", force: true do |t|
    t.string   "build_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tests", force: true do |t|
    t.string   "class_name"
    t.string   "name"
    t.text     "log"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
