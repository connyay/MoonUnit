class TestResultsHistoryController < ApplicationController

	def show
		test_result = TestResult.find(params[:test_result_id])
		user = User.find_by(:name => params[:user_name])
		results = TestResult.order('test_results.created_at DESC').includes(:test_run, :test).where(:test_id => test_result.test_id, 'test_runs.user_id' => user.id)
		render :json => results, :status => :ok, :include_build_id => true
	end

	def default_serializer_options
		{root: false}
	end
end
