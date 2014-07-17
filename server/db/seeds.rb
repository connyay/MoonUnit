# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)



#testRun = TestRun.create(:build_id => "RMS5.0.2N_20140704")

#1.upto(10) do |i|
#	test = Test.create(:class_name => "com.ibm.test", :name => "Test #{i}")
#	if i % 3 == 0
#		test.test_results.create(:test_run_id => testRun.id, :result => "fail")
#	else
#		test.test_results.create(:test_run_id => testRun.id, :result => "pass")
#	end
#end

user = User.create(:name => "jllankford")
User.create(:name => "rmauto")

# conn = ActiveRecord::Base.connection
# inserts = []
# a = 0

# puts "Creating tests..."
# #Create 2000 tests
# 4.times do 
# 	500.times do
# 		a = a + 1
# 		inserts.push("('com.ibm.test', 'TestClass', 'test#{a}')");
# 	end
# 	sql = "INSERT INTO tests ('package', 'class_name', 'name') VALUES #{inserts.join(", ")}"
# 	conn.execute sql
# 	inserts.clear
# end

# a = 0
# b = 0
# inserts.clear

# puts "Creating builds and results..."
# t1 = Time.now.to_f
# 1.times do
# 	a = a + 1
# 	puts "Creating build #{a}"
# 	test_run = user.test_runs.create(:build_id => "testBuild#{a}")

# 	4.times do 
# 		500.times do
# 			b = b + 1
# 			inserts.push("(#{b}, #{a}, 'pass', '123')");
# 		end
# 		sql = "INSERT INTO test_results ('test_id', 'test_run_id', 'result', 'checksum') VALUES #{inserts.join(", ")}"
# 		conn.execute sql
# 		inserts.clear
# 		b=0
# 	end
# end
# t2 = Time.now.to_f

# puts "Finished in #{t2-t1}s"