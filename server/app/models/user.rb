class User < ActiveRecord::Base
	validates_presence_of :name
	validates_uniqueness_of :name
	
	has_many :test_runs, -> {order 'created_at DESC'}, dependent: :destroy
end
