class PackagesController < ApplicationController

	def index
		@packages = TestResult.joins(:test).where(:test_run_id => params[:test_run_id]).uniq.pluck(:package)

	end

	def show
		@test_results = TestResult.joins(:test).where("test_run_id = ? AND tests.package = ?", params[:test_run_id], params[:id])
	end
end
