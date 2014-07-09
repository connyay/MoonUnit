require 'nokogiri'
require 'net/http'

module ImportModule

	def self.import(user, raw_xml)

		#XML parsing code
		doc = Nokogiri::XML(raw_xml)
		#try to get the build id from this property 
		build = doc.css("property[name='latestGoodBuild']")[0][:value]

		#Use existing or create new build
		test_run = user.test_runs.includes(test_results: [:test]).find_by(:build_id => build)
		test_run = user.test_runs.create(:build_id => build) if not test_run

		tests = doc.css("testcase")

		ActiveRecord::Base.transaction do

			tests.each do |test|
				test_result = test_run.test_results.find_by(:checksum => test[:id])
				next if test_result

				full_name = test[:classname]
				name = test[:name]
				r = full_name.rindex('.')
				package = full_name[0..r-1]
				class_name = full_name[r+1..full_name.length]

				result = "pass"
				time = test[:time].to_f

				#fetch or create the test record
				test_record = create_test(package, class_name, name)

				failure = test.css("failure")
				log = nil

				if failure.any?
					log = failure.text
					result = "fail"
				end

				test_record.test_results.create(:result => result, :time => time, :test_run_id => test_run.id, :checksum => test[:id], :log => log )

			end
		end

		#End XML parsing

		return [{:message => "sucess"}, :created]
	end

	def self.importFromUrl(user, uri)
		response = Net::HTTP.get(URI.parse(uri))
		return import(user,response)
	end

	private 

	def self.create_test(package, class_name, name)
		test = Test.find_by(:package => package, :class_name => class_name, :name => name)
		if not test
			test = Test.create(:package => package, :class_name => class_name, :name => name)
		end

		return test
	end

end
