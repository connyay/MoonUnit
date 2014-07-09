class TestResultsController < ApplicationController

	def show
		test_result = TestResult.find(params[:id])
		test = Test.includes(test_results: [:test_run]).find(test_result.test_id)
		render :json => test_result.test.test_results, :status => :ok, :include_build_id => true
	end


	def default_serializer_options
		{root: false}
	end
end
