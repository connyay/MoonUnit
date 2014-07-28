class TestResultsController < ApplicationController

	def show
		test_result = TestResult.find(params[:id])
		render :json => test_result, :status => :ok
	end


	def default_serializer_options
		{root: false}
	end
end
