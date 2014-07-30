class TestRunShortSerializer < ActiveModel::Serializer
	cached
	attributes :id, :build_id, :locked, :created_at, :pass, :fail, :error

	def pass
		return object.test_results.where(:result => "pass").count
	end

	def fail
		return object.test_results.where(:result => "fail").count
	end

	def error
		return object.test_results.where(:result => "error").count
	end

	def url
		if options[:user_name]
			name = options[:user_name]
		else
			name = object.user.name
		end

		return url_for(controller: 'test_runs', action: 'show', id: object.id, :user_name => name)
	end

	def cache_key
		object.cache_key
	end

end
