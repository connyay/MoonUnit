class TestRunsController < ApplicationController

	def index
		@test_runs = TestRun.all
	end

	def show
		@test_run = TestRun.find(params[:id])

		respond_to do |format|
			format.html
			format.json{render :json => @test_run, :status => :ok}
		end
	end

	private
	 
	def default_serializer_options
		{root: false}
	end
end
