class TestRun < ActiveRecord::Base
  validates_presence_of :build_id
  has_many :test_results, dependent: :destroy
end
