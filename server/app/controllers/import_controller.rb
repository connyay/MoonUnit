require 'ImportModule'

class ImportController < ApplicationController

	protect_from_forgery :except => :create 
	
	def create
		user = User.find_by(:name => params[:user_name])
		#optional
		build_id = params[:build_id]

		location = request.headers[:location]
		if location
			test_run = ImportModule.importFromUrl(user, location, build_id)
		else
			test_run = ImportModule.import(user,request.body.read, build_id)
		end

		if not test_run.errors.any?
			render :json => {:message => "sucess"}, :status => :created, :location => url_for(controller: 'test_runs', action: 'show', id: test_run.id)
		else
			render :json => {:errors => test_run.errors.full_messages}, :status => :bad_request
		end
	end
end