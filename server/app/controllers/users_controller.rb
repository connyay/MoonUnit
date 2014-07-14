class UsersController < ApplicationController

	protect_from_forgery :except => :create 


	swagger_controller :users, "User Management"

	swagger_api :index do
	  summary "Gets all users and their builds"
	  notes "This will return a alist of all users along with build ids"
	  param :query, :page, :integer, :optional, "Page number"
	  response :ok
	end

	swagger_api :create do
	  summary "Creates a user"
	  param :form, :name, :User, :required, "User"
	  response :created
	  response :bad_request
	end

	swagger_model :User do
		description "User model"
		property :name, :string, :required, "Name"
	end
	
	def index 
		users = User.includes(:test_runs).where.not(:name => "rmauto@us.ibm.com")
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
