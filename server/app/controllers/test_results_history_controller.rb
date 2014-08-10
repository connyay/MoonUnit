class TestResultsHistoryController < ApplicationController

=begin
	@api {get} /users/:name/test_results/:id/history Get Test Result History
	@apiName getTestResultHistory
	@apiGroup Test Result History
	
	@apiParam {String} name User name
	@apiParam {Integer} id Test result id

	@apiSuccess {Integer} id Test result id
	@apiSuccess {String} result A string containg the result (pass,fail,error)
	@apiSuccess {Float} time Contains the execution time of the test
	@apiSuccess {String} package Test package
	@apiSuccess {String} class_name Test class name
	@apiSuccess {String} name Test method name
	@apiSuccess {String} log String containg the stack trace (can be null)
	@apiSuccess {String} build_id The name of the build that this result is associated with

	@apiSuccessExample Success Response:
	HTTP/1.1 200 OK
	[
    {
        "id": 10989,
        "result": "pass",
        "time": 0.137,
        "package": "com.ibm.rdm.client.api.tests",
        "class_name": "LicenseAvailabilityTest",
        "name": "testLicenseAvailability",
        "log": null,
        "build_id": "test2"
    },
    ]

	@apiErrorExample Error Response:
	HTTP/1.1 404 NOT FOUND
	{
		"error": "Resource not found"
	}
=end
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
