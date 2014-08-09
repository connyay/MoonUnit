class UsersController < ApplicationController

	protect_from_forgery :except => :create 
	
=begin
	@api {get} /users Get a list of users
	@apiName GetUsers
	@apiGroup Users

	@apiSuccess {String} name User name
	@apiSuccess {String} test_run_count Number of test runs owned by this user

	@apiSuccessExample Success Response:
	HTTP/1.1 200 OK
	[{
	    "name": "Jerrod",
	    "test_run_count": 5
	}]
=end
	def index 
		users = User.where.not(:name => "rmauto")
		render :json => users, :status => :ok
	end


=begin
	@api {get} /users/:name Get an individual user
	@apiName getUser
	@apiGroup Users
	
	@apiParam {String} name User name

	@apiDescription This API is deprecated. See GET /users/:name/test_runs
=end

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

=begin

	@api {delete} /users/:name Delete a user
	@apiName deleteUser
	@apiGroup Users

	@apiParam {String} name User name
	@apiDescription Deletes a user and all associated test runs/results

	@apiSuccessExample Sucess Response:
	HTTP/1.1 200 OK

	@apiErrorExample Error Response:
	HTTP/1.1 404 NOT FOUND

=end
	def destroy
		user = User.find_by(:name => params[:name])
		if user
			user.destroy
			head :ok
		else
			head :not_found
		end
	end

=begin
	@api {post} /users Create a user
	@apiName createUser
	@apiGroup Users

	@apiParam {String} name User name
	@apiDescription Send the name parameter through form-data or json data

	@apiExample Post body
	{
	    "name" : "jerrod"
	}
=end
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
