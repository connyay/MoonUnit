require 'digest/md5'
#####################
# This cache doesn't store the active record
# but instead acts more simply as a qualifed name to id
# mapping. This keeps us from having to query db2, which 
# seems to take longer than it should on bluemix.
# if performance issues are fixed then this may not be necessary
#####################

module TestCache
 	def createOrFetch(package, class_name, name)

 		hash = Digest::MD5.hexdigest("test-#{package}.#{class_name}.#{name}")

		test_id = Rails.cache.fetch(hash) do
			test = Test.find_by(:package => package, :class_name => class_name, :name => name)
			"#{test.id}" unless test.nil?
		end

		unless test_id
			test = Test.create(:package => package, :class_name => class_name, :name => name)
			test_id = test.id
			Rails.cache.write(hash,test_id)
		end

		return test_id
 	end
end