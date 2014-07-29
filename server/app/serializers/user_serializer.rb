class UserSerializer < ActiveModel::Serializer
	attributes :name, :test_run_count

	def test_run_count
		return object.test_runs.count
	end

end
