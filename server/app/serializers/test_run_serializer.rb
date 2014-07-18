class TestRunSerializer < ActiveModel::Serializer
	attributes :build_id, :created_at
	has_many :test_results

end
