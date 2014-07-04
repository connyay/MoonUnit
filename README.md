# Read Me

### To generate sample data

run rake db:seed and it will generate 1 test run and 10 test results with pass/fail

### Current models

TestRun
--build_id (string)
--test_results (TestResult)

Test
--class_name (string)
--name (string)
--log (text)

TestResult
--test (Test)
--result (string)
