require 'ImportTask'

class ImportController < ApplicationController

	protect_from_forgery :except => :create 

=begin
	@api {post} /users/:name/import?build_id=... Import Test Run
	@apiName importTestRun
	@apiGroup Import

	@apiParam {String} name User name
	@apiParam {String} build_id Optional property to specify the name of the imported run

	@apiDescription Imports a junit report style xml file into a test run

	@apiExample Example:
	<?xml version="1.0" encoding="UTF-8" ?>
	<testsuite errors="2" failures="3" hostname="fit-vm8-221" name="com.ibm.rdm.client.api.tests.auto.AllCloudTestsPart1" tests="827" time="4006.873" timestamp="2014-07-07T15:50:32">
  	<testcase classname="com.ibm.rdm.client.api.tests.compactrender.CommentsCompactRenderingTest" endTimestamp="2014-07-07T16:56:28" id="9accc2af-b8aa-4d7f-bdc8-fc4e7e646b99" name="testCommentCompactRendering" startTimestamp="2014-07-07T16:56:26" time="1.103" />
  	<testcase classname="com.ibm.rdm.client.api.tests.compactrender.BaselineCompactRenderingTest" endTimestamp="2014-07-07T16:56:31" id="23aebd7a-dc16-4855-a38b-6387b198bdaf" name="testBaselineCompactRendering" startTimestamp="2014-07-07T16:56:28" time="3.349" />
	</testsuite>

	@apiSuccessExample Success Response:
	HTTP/1.1 202 ACCEPTED

=end
	def create

		task_params = {}

		task_params[:user] = User.where(:name => params[:user_name]).first_or_create
		#optional
		task_params[:build_id] = params[:build_id]

		task_params[:location] = request.headers[:location]

		if not location
			task_params[:raw_xml] = request.body.read
		end

		ImportTask.new(task_params).run

		head :accepted
	end
end