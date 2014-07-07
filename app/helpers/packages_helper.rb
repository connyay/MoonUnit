module PackagesHelper

	def package_path(test_run_id, package)
		return "/test_runs/#{test_run_id}/packages/#{package}"
	end

end
