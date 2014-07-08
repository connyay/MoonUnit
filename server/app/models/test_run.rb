class TestRun < ActiveRecord::Base
  validates_presence_of :build_id, :user_id
  has_many :test_results, dependent: :destroy
  belongs_to :user
end
