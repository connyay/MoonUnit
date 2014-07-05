class TestResult < ActiveRecord::Base
  validates_presence_of :test_id, :test_run_id, :result
  belongs_to :test
  belongs_to :test_run
end
