class UsersController < ApplicationController

	def index 
		users = User.includes(:test_runs).all
		render :json => users, :status => :ok
	end

	private

	def default_serializer_options
		{root: false}
	end
end
