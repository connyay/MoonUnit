class User < ActiveRecord::Base
	validates_presence_of :name
	has_many :test_runs, dependent: :destroy
end
