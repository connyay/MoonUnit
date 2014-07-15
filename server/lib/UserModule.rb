module UserModule

	def fetchOrCreate(user_name)
		user = User.find_by(:name => user_name)
		if user.nil?
			user = User.create(:name => user_name)
		end

	return user
	end
end