require 'ImportTask'

Delayed::Worker.logger = Rails.logger
Delayed::Worker.destroy_failed_jobs = false
