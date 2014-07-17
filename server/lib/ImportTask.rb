require 'nokogiri'
require 'net/http'

class ImportTask

	def initialize(task_params)
		@task_params = task_params
	end

	def run
		user = @task_params[:user]
		raw_xml = @task_params[:raw_xml]
		build_id = @task_params[:build_id]
		location = @task_params[:location]

		Spawnling.new do
			if location
				importFromUrl(user,location,build_id)
			else
				import(user,raw_xml,build_id)
			end
		end
	end

	#if build id is null it will try to use the property latestGoodBuild
	#if that fails it will use a timestamp
	def import(user, raw_xml,build_id)

		#XML parsing code
		doc = Nokogiri::XML(raw_xml)
		
		#Get the build id from three places. Url params, xml property, or last resort generate one
		if build_id.nil?
			build_selector = doc.css("property[name='latestGoodBuild']")[0]
			build = build_selector[:value] unless build_selector.nil?
			build = Time.now.strftime("BUILD_%Y.%m.%d_%H.%M.%S") if build.nil?
		else
			build = build_id
		end

		#Use existing or create new build
		test_run = user.test_runs.includes(test_results: [:test]).find_by(:build_id => build)
		test_run = user.test_runs.create(:build_id => build) if not test_run

		tests = doc.css("testcase")

		ActiveRecord::Base.transaction do

			tests.each do |test|
				#If the test has a checksum, we need to verify its not a duplicate
				unless test[:id].nil?
					test_result = test_run.test_results.find_by(:checksum => test[:id])
					next if test_result
				end

				full_name = test[:classname]
				name = test[:name]
				r = full_name.rindex('.')

				#If there is no package, set the full name and use the default package
				if r.nil?
					package = Test.DEFAULT_PACKAGE
					class_name = full_name
				else
					package = full_name[0..r-1] unless r.nil?
					class_name = full_name[r+1..full_name.length]
				end

				result = "pass"
				time = test[:time].to_f

				#fetch or create the test record
				test_record = create_test(package, class_name, name)

				failure = test.css("failure")
				error = test.css("error")
				log = nil

				if failure.any?
					log = failure.text
					result = "fail"
				elsif error.any?
					log = error.text
					result = "error"
				end

				#ignore duplicate tests like licenseAvailability until I can find a better solution
				next if test_record.test_results.find_by(:test_run_id => test_run.id)

				test_record.test_results.create(:result => result, :time => time, :test_run_id => test_run.id, :checksum => test[:id], :log => log )

			end
		end

		#End XML parsing

		return test_run
	end

	def importFromUrl(user, uri, build_id)
		response = Net::HTTP.get(URI.parse(uri))
		return import(user,response, build_id)
	end

	private 

	def create_test(package, class_name, name)
		test = Test.find_by(:package => package, :class_name => class_name, :name => name)
		if not test
			test = Test.create(:package => package, :class_name => class_name, :name => name)
		end

		return test
	end

end
