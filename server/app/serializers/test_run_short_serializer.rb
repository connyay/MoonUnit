class TestRunShortSerializer < ActiveModel::Serializer
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


	#Only display the url if we pass in a user_name, we don't want to have to query for it if we dont need it
	def attributes
		data = super
		data[:url] = url_for(controller: 'test_runs', action: 'show', id: object.id, :user_name => options[:user_name]) if options[:user_name]
		return data
	end

end
