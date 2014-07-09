class UsersController < ApplicationController

	def index 
		users = User.includes(:test_runs).all
		render :json => users, :status => :ok
	end

	def show
		user = User.find_by(:name => params[:name])
		
		#We have to check here since find by doesnt throw the recordNotFound exception
		if user
			render :json => user, :status => :ok
		else
			render :json => {:error => "User #{params[:name]} not found"}, :status => :not_found
		end

	end

	private

	def default_serializer_options
		{root: false}
	end
end
