class TestRunSerializer < ActiveModel::Serializer
	cached
	attributes :build_id, :created_at, :id, :url
	has_many :test_results

	def cache_key
		object.cache_key
	end

	def url

		#Avoid a query if we can
		if options[:user_name]
			name = options[:user_name]
		else
			name = object.user.name
		end

		return url_for(controller: 'test_runs', action: 'show', id: object.id, :user_name => options[:user_name])
	end
end
