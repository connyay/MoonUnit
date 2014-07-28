class TestResultSerializer < ActiveModel::Serializer
  attributes :result, :time, :package, :class_name, :name, :log



	def package
		return object.test[:package]		
	end

	def class_name 
		return object.test[:class_name]
	end

	def name
		return object.test[:name]
	end

	def attributes
  		data = super
  		data[:build_id] = object.test_run.build_id if options[:include_build_id]
  		return data
	end
end
