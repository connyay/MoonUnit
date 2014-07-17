class TestRun < ActiveRecord::Base
  validates_presence_of :build_id, :user_id
  has_many :test_results, dependent: :destroy
  validates_uniqueness_of :build_id, :scope => :user_id
  belongs_to :user
end
