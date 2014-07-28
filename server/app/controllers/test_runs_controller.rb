require 'builder'

class TestRunsController < ApplicationController
	protect_from_forgery :except => :destroy
	rescue_from ActiveRecord::RecordNotFound , :with => :not_found

	def index
		test_runs = TestRun.all
	end

	def show
		#Category.includes(posts: [{ comments: :guest }, :tags]).find(1)
		test_run = Rails.cache.fetch "test-run-#{params[:id]}" do
			TestRun.includes(test_results: [:test]).find(params[:id])
		end
		respond_to do |format|
			format.xml{render :xml => buildXmlReport(test_run), :status => :ok}
			format.any(:html, :json) {render :json => test_run, :status => :ok}
		end
	end

	def update
		test_run = TestRun.find(params[:id])
		if test_run.update(:build_id => params[:build_id])
			Rails.cache.delete "test-run-#{params[:id]}"
			head :ok
		else
			render :json => {errors: test_run.errors.full_messages}, :status => :bad_request
		end

	end

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
