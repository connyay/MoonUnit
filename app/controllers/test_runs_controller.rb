class TestRunsController < ApplicationController

	def index
		@test_runs = TestRun.all
	end

	def show
		@test_run = TestRun.find(params[:id])
	end
end
