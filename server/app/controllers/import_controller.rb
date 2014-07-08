require 'nokogiri'

class ImportController < ApplicationController

	protect_from_forgery :except => :create 
	
	def create

		user = User.find_by(:name => params[:user_name])
		#XML parsing code
		doc = Nokogiri::XML(request.body.read)
		#try to get the build id from this property 
		build = doc.css("property[name='latestGoodBuild']")[0][:value]

		#Use existing or create new build
		test_run = user.test_runs.find_by(:build_id => build)
		test_run = user.test_runs.create(:build_id => build) if not test_run

		tests = doc.css("testcase")
		tests.each do |test|
			full_name = test[:classname]
			name = test[:name]
			r = full_name.rindex('.')
			package = full_name[0..r-1]
			class_name = full_name[r+1..full_name.length]

			result = "pass"
			result = "fail" if test.css("failure").any?
			time = test[:time].to_f

			test_record = create_test(package, class_name, name)
			test_record.test_results.create(:result => result, :time => time, :test_run_id => test_run.id)
		end
		#End XML parsing

		

		respond_to do |format|
			format.json{render :json => {:message => "sucess"}, :status => :created}
		end
	end

	private 

	def create_test(package, class_name, name)
		test = Test.find_by(:package => package, :class_name => class_name, :name => name)
		if not test
			test = Test.create(:package => package, :class_name => class_name, :name => name)
		end

		if test.errors.any?
			respond_to do |format|
				format.json{render :json =>test.errors.messages, :status => :bad_request}
			end
		end

		return test
	end
end