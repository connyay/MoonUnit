class Test < ActiveRecord::Base
	has_many :test_results, dependent: :destroy
	validates_presence_of :package, :class_name, :name

	before_validation :set_package


 	def set_package
    	self.package ||= DEFAULT_PACKAGE
  	end

  	def self.DEFAULT_PACKAGE
  		return '(default package)'
  	end
end
