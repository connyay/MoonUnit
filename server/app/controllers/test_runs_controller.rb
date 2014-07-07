class TestRunsController < ApplicationController

	def index
		@test_runs = TestRun.all
	end

	def show
		@test_run = TestRun.find(params[:id])

		respond_to do |format|
			format.html
			format.json{render :json => @test_run.to_json(:include => :test_results), :status => :ok}
		end
	end
end
