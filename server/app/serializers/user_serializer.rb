class UserSerializer < ActiveModel::Serializer
	cached
	attributes :name, :test_runs

	def test_runs
		runs = []

		object.test_runs.order('created_at DESC').each do |test_run|
			pass = test_run.test_results.where(:result => "pass").count
			fail = test_run.test_results.where(:result => "fail").count
			error = test_run.test_results.where(:result => "error").count

			runs.append({:id => test_run.id, 
				:build_id => test_run.build_id,
				:url => url_for(controller: 'test_runs', action: 'show', id: test_run.id, :user_name => object[:name]), 
				:locked => test_run.locked, 
				:created_at => test_run.created_at,
				:pass => pass,
				:fail => fail,
				:error => error})
		end

		runs
	end

	def cache_key
		object.cache_key
	end
end
