require 'builder'

class TestRunsController < ApplicationController
	protect_from_forgery :except => :destroy
	rescue_from ActiveRecord::RecordNotFound , :with => :not_found

=begin
	@api {get} /users/:name/test_runs Get Test Runs
	@apiName getUsersTestRuns
	@apiGroup Test Runs
	
	@apiParam {String} name User name

	@apiSuccess {test_run} test_runs An array of the users test runs
	@apiSuccess {Integer} id Test run id
	@apiSuccess {String} build_id Name of the build that the test run is based off of
	@apiSuccess {Boolean} locked If it build is currently being updated or not
	@apiSuccess {Date} created_at Date that the test run was created
	@apiSuccess {Integer} pass Number of passes in the test run
	@apiSuccess {Integer} fail Number of failures in the test run
	@apiSuccess {Integer} error Number of errors in the test run

	@apiSuccessExample Success Response:
	HTTP/1.1 200 OK
	{
    "test_runs": [
        {
            "id": 164,
            "build_id": "RDNG5.0.2-T20140808_0906",
            "locked": false,
            "created_at": "2014-08-08T13:49:09.493Z",
            "pass": 19,
            "fail": 0,
            "error": 0
        },
	]
	}

	@apiErrorExample Error Response:
	HTTP/1.1 404 NOT FOUND
	{
		"error": "User jerrod not found"
	}
=end
	def index
		test_runs = User.includes(:test_runs).find_by(:name => params[:user_name]).test_runs
		render :json => test_runs, :status => :ok, each_serializer: TestRunShortSerializer, :user_name => params[:user_name], :root => "test_runs"
	end

=begin
	@api {get} /users/:name/test_runs/:id Get Test Run
	@apiName getUsersTestRun
	@apiGroup Test Runs
	
	@apiParam {String} name User name
	@apiParam {Integer} id Test run id

	@apiDescription Returns a json object representing a single test run, including all test results

	@apiSuccess {String} The name of the build associated with this test run
	@apiSuccess {Date} created_at The date on which this test run was created
	@apiSuccess {Integer} id The unique id associated with this test run
	@apiSuccess {String} url The url for the test run
	@apiSuccess {Array} test_results An array containing test results

	@apiSuccess {Integer} id The unique id of this test result
	@apiSuccess {String} result A string containg the result (pass,fail,error)
	@apiSuccess {Float} time Contains the execution time of the test
	@apiSuccess {String} package Test package
	@apiSuccess {String} class_name Test class name
	@apiSuccess {String} name Test method name
	@apiSuccess {String} log String containg the stack trace (can be null)
 
	@apiSuccessExample Success Response:
	HTTP/1.1 200 OK
	{
    "build_id": "test2",
    "created_at": "2014-08-06T19:39:00.590Z",
    "id": 13,
    "url": "http://localhost:3000/users/jllankford/test_runs/13",
    "test_results": [
        {
            "id": 10959,
            "result": "pass",
            "time": 6.329,
            "package": "com.ibm.rdm.client.api.tests.importer",
            "class_name": "ExportServiceTest",
            "name": "testExportThenImport",
            "log": null
        },
    ]
    }

	@apiErrorExample Error Response:
	HTTP/1.1 404 NOT FOUND
	{
		"error": "Resource not found"
	}
=end
	def show
		#Category.includes(posts: [{ comments: :guest }, :tags]).find(1)
		test_run = Rails.cache.fetch "test-run-#{params[:id]}" do
			TestRun.includes(test_results: [:test]).find(params[:id])
		end
		respond_to do |format|
			format.xml{render :xml => buildXmlReport(test_run), :status => :ok}
			format.any(:html, :json) {render :json => test_run, :status => :ok, :user_name => params[:user_name]}
		end
	end

=begin
	@api {put} /users/:name/test_runs/:id Update Test Run
	@apiName updateUsersTestRun
	@apiGroup Test Runs
	
	@apiParam {String} name User name
	@apiParam {Integer} id Test run id

	@apiDescription Currently only used for updating the name, 
 
 	@apiExample
 	{
		"build_id" : "updated name"
 	}

	@apiSuccessExample Success Response:
	HTTP/1.1 200 OK

	@apiErrorExample Error Response:
	HTTP/1.1 404 NOT FOUND
	{
    	"errors": [
        	"Build can't be blank"
    	]
	}
=end
	def update
		test_run = TestRun.find(params[:id])
		if test_run.update(:build_id => params[:build_id])
			Rails.cache.delete "test-run-#{params[:id]}"
			head :ok
		else
			render :json => {errors: test_run.errors.full_messages}, :status => :bad_request
		end

	end

=begin
	@api {delete} /users/:name/test_runs/:id Delete Test Run
	@apiName deleteUsersTestRun
	@apiGroup Test Runs
	
	@apiParam {String} name User name
	@apiParam {Integer} id Test run id

	@apiDescription Delete the specified test run and all associated test results

	@apiSuccessExample Success Response:
	HTTP/1.1 200 OK

	@apiErrorExample Error Response:
	HTTP/1.1 404 NOT FOUND
	{
		"error": "Resource not found"
	}
=end
	def destroy 
		test_run = TestRun.find(params[:id]).destroy
		Rails.cache.delete "test-run-#{params[:id]}"
		head :ok
	end

	private

	#Writing an adhoc serializer seemed easy enough since the junit xml requires a specific shape
	def buildXmlReport(test_run)

		#First we need to create metadata about the test results so we can generate the junit format
		#We are creatimng a map of test classes to test_results so we can create a heirarchy of them in the returned xml
		packages = {}
		pass,fail,error = 0,0,0
		test_run.test_results.each do |test_result|
			test = test_result.test
			key = "#{test.package}.#{test.class_name}"
			packages[key] = [] if packages[key].nil?
    		
    		packages[key].append test_result

			case test_result.result
			when "pass"
				pass+=1
			when "fail"
				fail+=1
			when "error"
				error+=1
			end

		end
		#end metadata

		doc = ""
		xml = Builder::XmlMarkup.new(:target => doc, :ident => 1)
		xml.instruct! :xml, :encoding => "ASCII"
		#<testrun name="Test (2)" project="Test" tests="3" started="3" failures="1" errors="1" ignored="0">
		xml.testrun(:name => test_run.build_id, :tests => "#{pass+fail+error}", :failures => fail, :errors => error) {
			packages.each do |key,package|
				xml.testsuite(:name => key) {
					package.each do |test_result|
						test = test_result.test
						# <testcase name="testError" classname="com.ibm.Test" time="0.001">
						xml.testcase(:name => test.name, :classname => "#{test.package}.#{test.class_name}", :time => test_result.time) {
							if test_result.result == "error"
								xml.error test_result.log
							elsif test_result.result == "fail"
								xml.failure test_result.log
							end
						}
					end
				}
			end
		}

		return doc
	end

	def default_serializer_options
		{root: false}
	end
end
