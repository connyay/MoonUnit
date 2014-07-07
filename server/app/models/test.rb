class Test < ActiveRecord::Base
	has_many :test_results, dependent: :destroy
	validates_presence_of :package, :class_name, :name
end
