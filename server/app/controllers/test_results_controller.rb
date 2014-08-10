class TestResultsController < ApplicationController
	rescue_from ActiveRecord::RecordNotFound , :with => :not_found

=begin
	@api {get} /users/:name/test_results/:id Get Test
	@apiName getTestResult
	@apiGroup Test Results
	
	@apiParam {String} name User name
	@apiParam {Integer} id Test result id

	@apiDescription Not currently used in the web ui

	@apiSuccess {Integer} id Test result id
	@apiSuccess {String} result A string containg the result (pass,fail,error)
	@apiSuccess {Float} time Contains the execution time of the test
	@apiSuccess {String} package Test package
	@apiSuccess {String} class_name Test class name
	@apiSuccess {String} name Test method name
	@apiSuccess {String} log String containg the stack trace (can be null)

	@apiSuccessExample Success Response:
	HTTP/1.1 200 OK
	{
    	"id": 1,
    	"result": "pass",
    	"time": 0.143,
    	"package": "com.ibm.rdm.client.api.tests",
    	"class_name": "LicenseAvailabilityTest",
    	"name": "testLicenseAvailability",
    	"log": null
	}

	@apiErrorExample Error Response:
	HTTP/1.1 404 NOT FOUND
	{
		"error": "Resource not found"
	}
=end
	def show
		test_result = TestResult.find(params[:id])
		render :json => test_result, :status => :ok
	end


	def default_serializer_options
		{root: false}
	end
end
