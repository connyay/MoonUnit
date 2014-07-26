module UserModule

	def fetchOrCreate(user_name)
		User.where(:name => user_name).first_or_create
	end
end