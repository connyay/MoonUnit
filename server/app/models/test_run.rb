class TestRun < ActiveRecord::Base
  validates_presence_of :build_id, :user_id
  has_many :test_results, dependent: :destroy
  belongs_to :user

  alias :old_test_results :test_results

  def test_results
  	return test_results[0]
  end
end
