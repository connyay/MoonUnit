require 'ImportTask'
require 'UserModule'

class ImportController < ApplicationController

	protect_from_forgery :except => :create 
	include UserModule
	
	def create

		task_params = {}

		task_params[:user] = fetchOrCreate(params[:user_name])
		#optional
		task_params[:build_id] = params[:build_id]

		task_params[:location] = request.headers[:location]

		if not location
			task_params[:raw_xml] = request.body.read
		end

		ImportTask.new(task_params).run

		head :accepted
	end
end