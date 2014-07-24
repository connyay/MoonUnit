require 'digest/md5'

module TestCache
 	def createOrFetch(package, class_name, name)

 		hash = Digest::MD5.hexdigest("test-#{package}.#{class_name}.#{name}")

		test = Rails.cache.fetch(hash) do
			puts "MISS"
			Test.find_by(:package => package, :class_name => class_name, :name => name)
		end

		if not test
			test = Test.create(:package => package, :class_name => class_name, :name => name)
			Rails.cache.write(hash,test)
		end

		return test
 	end
end