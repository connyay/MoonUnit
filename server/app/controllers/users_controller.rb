class UsersController < ApplicationController

	def index 
		respond_to do |format|
			users = User.includes(:test_runs).all
			format.json{render :json => users, :status => :ok}
		end
	end

	private

	def default_serializer_options
		{root: false}
	end
end
