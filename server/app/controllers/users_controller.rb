class UsersController < ApplicationController

	protect_from_forgery :except => :create 
	
	def index 
		users = User.includes(:test_runs).where.not(:name => "rmauto")
		render :json => users, :status => :ok
	end

	def show
		user = User.find_by(:name => params[:name])
		
		#We have to check here since find by doesnt throw the recordNotFound exception
		if user
			render :json => user, :status => :ok, :user_name => user.name
		else
			render :json => {:error => "User #{params[:name]} not found"}, :status => :not_found
		end

	end

	def destroy
		user = User.find_by(:name => params[:name])
		if user
			user.destroy
			head :ok
		else
			head :not_found
		end
	end

	def create
		user = User.new(:name => params[:name])

		if user.save
			head :created
		else
			render :json => {:errors => user.errors.full_messages}, :status => :bad_request
		end
	end

	private

	def default_serializer_options
		{root: false}
	end
end
