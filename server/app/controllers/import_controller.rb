require 'ImportTask'

class ImportController < ApplicationController

	protect_from_forgery :except => :create 
	
	def create

		task_params = {}

		task_params[:user] = User.where(:name => params[:user_name]).first_or_create
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