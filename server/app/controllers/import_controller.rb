require 'ImportModule'

class ImportController < ApplicationController

	protect_from_forgery :except => :create 
	
	def create
		user = User.find_by(:name => params[:user_name])

		location = request.headers[:location]
		if location
			data = ImportModule.importFromUrl(user, location)
		else
			data = ImportModule.import(user,request.body.read)

		end


		#data returns a hash with the response and a response code
		render :json => data[0], :status => data[1]
	end
end