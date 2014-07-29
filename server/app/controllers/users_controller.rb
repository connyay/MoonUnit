class UsersController < ApplicationController

	protect_from_forgery :except => :create 
	
	def index 
		users = User.where.not(:name => "rmauto")
		render :json => users, :status => :ok
	end

	#TODO Remove this and just use /user/test_runs
	#But removing this will break RMTOOLS view junit results button
	def show
		user = User.includes(:test_runs).find_by(:name => params[:name])
		
		#We have to check here since find by doesnt throw the recordNotFound exception
		if user
			render :json => user.test_runs, :status => :ok, each_serializer: TestRunShortSerializer, :user_name => user.name, :root => "test_runs"
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
