class TestRunSerializer < ActiveModel::Serializer
	cached
	attributes :build_id, :created_at, :id
	has_many :test_results

	def cache_key
		object.cache_key
	end
end
