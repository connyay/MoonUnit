class TestRunSerializer < ActiveModel::Serializer
	attributes :build_id
	has_many :test_results

end
