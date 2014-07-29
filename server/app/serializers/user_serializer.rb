class UserSerializer < ActiveModel::Serializer
	cached
	attributes :name

	#Eventually we will probably remove this in favor of a counts
	#But it would break rm tools view junit results button
	has_many :test_runs, serializer: TestRunShortSerializer


	def cache_key
		if options[:user_name]
			return "wu-#{object.cache_key}"
		else
			object.cache_key
		end
	end
end
