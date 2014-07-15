class UserSerializer < ActiveModel::Serializer
	attributes :name, :test_runs

	def test_runs
		runs = []

		object.test_runs.each do |test_run|
			runs.append({:id => test_run.id, :build_id => test_run.build_id, :url => url_for(controller: 'test_runs', action: 'show', id: test_run.id, :user_name => object[:name])})
		end

		runs
	end
end
