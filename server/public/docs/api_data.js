define({ api: [
  {
    "type": "post",
    "url": "/users/:name/import?build_id=...",
    "title": "Import Test Run",
    "name": "importTestRun",
    "group": "Import",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "<p>User name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "build_id",
            "optional": false,
            "description": "<p>Optional property to specify the name of the imported run</p>"
          }
        ]
      }
    },
    "description": "<p>Imports a junit report style xml file into a test run</p>",
    "examples": [
      {
        "title": "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>",
        "content": "<testsuite errors=\"2\" failures=\"3\" hostname=\"fit-vm8-221\" name=\"com.ibm.rdm.client.api.tests.auto.AllCloudTestsPart1\" tests=\"827\" time=\"4006.873\" timestamp=\"2014-07-07T15:50:32\">\n\t<testcase classname=\"com.ibm.rdm.client.api.tests.compactrender.CommentsCompactRenderingTest\" endTimestamp=\"2014-07-07T16:56:28\" id=\"9accc2af-b8aa-4d7f-bdc8-fc4e7e646b99\" name=\"testCommentCompactRendering\" startTimestamp=\"2014-07-07T16:56:26\" time=\"1.103\" />\n\t<testcase classname=\"com.ibm.rdm.client.api.tests.compactrender.BaselineCompactRenderingTest\" endTimestamp=\"2014-07-07T16:56:31\" id=\"23aebd7a-dc16-4855-a38b-6387b198bdaf\" name=\"testBaselineCompactRendering\" startTimestamp=\"2014-07-07T16:56:28\" time=\"3.349\" />\n</testsuite>\n"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 202 ACCEPTED\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/app/controllers/import_controller.rb"
  },
  {
    "type": "get",
    "url": "/users/:name/test_results/:id/history",
    "title": "Get Test Result History",
    "name": "getTestResultHistory",
    "group": "Test_Result_History",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "<p>User name</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "field": "id",
            "optional": false,
            "description": "<p>Test result id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "field": "id",
            "optional": false,
            "description": "<p>Test result id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "result",
            "optional": false,
            "description": "<p>A string containg the result (pass,fail,error)</p>"
          },
          {
            "group": "Success 200",
            "type": "Float",
            "field": "time",
            "optional": false,
            "description": "<p>Contains the execution time of the test</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "package",
            "optional": false,
            "description": "<p>Test package</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "class_name",
            "optional": false,
            "description": "<p>Test class name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "<p>Test method name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "log",
            "optional": false,
            "description": "<p>String containg the stack trace (can be null)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "build_id",
            "optional": false,
            "description": "<p>The name of the build that this result is associated with</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n      \"id\": 10989,\n      \"result\": \"pass\",\n      \"time\": 0.137,\n      \"package\": \"com.ibm.rdm.client.api.tests\",\n      \"class_name\": \"LicenseAvailabilityTest\",\n      \"name\": \"testLicenseAvailability\",\n      \"log\": null,\n      \"build_id\": \"test2\"\n  },\n  ]\n"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response:",
          "content": "HTTP/1.1 404 NOT FOUND\n{\n\"error\": \"Resource not found\"\n}\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/app/controllers/test_results_history_controller.rb"
  },
  {
    "type": "get",
    "url": "/users/:name/test_results/:id",
    "title": "Get Test",
    "name": "getTestResult",
    "group": "Test_Results",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "<p>User name</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "field": "id",
            "optional": false,
            "description": "<p>Test result id</p>"
          }
        ]
      }
    },
    "description": "<p>Not currently used in the web ui</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "field": "id",
            "optional": false,
            "description": "<p>Test result id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "result",
            "optional": false,
            "description": "<p>A string containg the result (pass,fail,error)</p>"
          },
          {
            "group": "Success 200",
            "type": "Float",
            "field": "time",
            "optional": false,
            "description": "<p>Contains the execution time of the test</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "package",
            "optional": false,
            "description": "<p>Test package</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "class_name",
            "optional": false,
            "description": "<p>Test class name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "<p>Test method name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "log",
            "optional": false,
            "description": "<p>String containg the stack trace (can be null)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \t\"id\": 1,\n  \t\"result\": \"pass\",\n  \t\"time\": 0.143,\n  \t\"package\": \"com.ibm.rdm.client.api.tests\",\n  \t\"class_name\": \"LicenseAvailabilityTest\",\n  \t\"name\": \"testLicenseAvailability\",\n  \t\"log\": null\n}\n"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response:",
          "content": "HTTP/1.1 404 NOT FOUND\n{\n\"error\": \"Resource not found\"\n}\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/app/controllers/test_results_controller.rb"
  },
  {
    "type": "delete",
    "url": "/users/:name/test_runs/:id",
    "title": "Delete Test Run",
    "name": "deleteUsersTestRun",
    "group": "Test_Runs",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "<p>User name</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "field": "id",
            "optional": false,
            "description": "<p>Test run id</p>"
          }
        ]
      }
    },
    "description": "<p>Delete the specified test run and all associated test results</p>",
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response:",
          "content": "HTTP/1.1 404 NOT FOUND\n{\n\"error\": \"Resource not found\"\n}\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/app/controllers/test_runs_controller.rb"
  },
  {
    "type": "get",
    "url": "/users/:name/test_runs/:id",
    "title": "Get Test Run",
    "name": "getUsersTestRun",
    "group": "Test_Runs",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "<p>User name</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "field": "id",
            "optional": false,
            "description": "<p>Test run id</p>"
          }
        ]
      }
    },
    "description": "<p>Returns a json object representing a single test run, including all test results</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "The",
            "optional": false,
            "description": "<p>name of the build associated with this test run</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "created_at",
            "optional": false,
            "description": "<p>The date on which this test run was created</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "field": "id",
            "optional": false,
            "description": "<p>The unique id associated with this test run</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "url",
            "optional": false,
            "description": "<p>The url for the test run</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "field": "test_results",
            "optional": false,
            "description": "<p>An array containing test results</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "field": "id",
            "optional": false,
            "description": "<p>The unique id of this test result</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "result",
            "optional": false,
            "description": "<p>A string containg the result (pass,fail,error)</p>"
          },
          {
            "group": "Success 200",
            "type": "Float",
            "field": "time",
            "optional": false,
            "description": "<p>Contains the execution time of the test</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "package",
            "optional": false,
            "description": "<p>Test package</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "class_name",
            "optional": false,
            "description": "<p>Test class name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "<p>Test method name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "log",
            "optional": false,
            "description": "<p>String containg the stack trace (can be null)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"build_id\": \"test2\",\n  \"created_at\": \"2014-08-06T19:39:00.590Z\",\n  \"id\": 13,\n  \"url\": \"http://localhost:3000/users/jllankford/test_runs/13\",\n  \"test_results\": [\n      {\n          \"id\": 10959,\n          \"result\": \"pass\",\n          \"time\": 6.329,\n          \"package\": \"com.ibm.rdm.client.api.tests.importer\",\n          \"class_name\": \"ExportServiceTest\",\n          \"name\": \"testExportThenImport\",\n          \"log\": null\n      },\n  ]\n  }\n"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response:",
          "content": "HTTP/1.1 404 NOT FOUND\n{\n\"error\": \"Resource not found\"\n}\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/app/controllers/test_runs_controller.rb"
  },
  {
    "type": "get",
    "url": "/users/:name/test_runs",
    "title": "Get Test Runs",
    "name": "getUsersTestRuns",
    "group": "Test_Runs",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "<p>User name</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "test_run",
            "field": "test_runs",
            "optional": false,
            "description": "<p>An array of the users test runs</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "field": "id",
            "optional": false,
            "description": "<p>Test run id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "build_id",
            "optional": false,
            "description": "<p>Name of the build that the test run is based off of</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "locked",
            "optional": false,
            "description": "<p>If it build is currently being updated or not</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "created_at",
            "optional": false,
            "description": "<p>Date that the test run was created</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "field": "pass",
            "optional": false,
            "description": "<p>Number of passes in the test run</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "field": "fail",
            "optional": false,
            "description": "<p>Number of failures in the test run</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "field": "error",
            "optional": false,
            "description": "<p>Number of errors in the test run</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"test_runs\": [\n      {\n          \"id\": 164,\n          \"build_id\": \"RDNG5.0.2-T20140808_0906\",\n          \"locked\": false,\n          \"created_at\": \"2014-08-08T13:49:09.493Z\",\n          \"pass\": 19,\n          \"fail\": 0,\n          \"error\": 0\n      },\n]\n}\n"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response:",
          "content": "HTTP/1.1 404 NOT FOUND\n{\n\"error\": \"User jerrod not found\"\n}\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/app/controllers/test_runs_controller.rb"
  },
  {
    "type": "put",
    "url": "/users/:name/test_runs/:id",
    "title": "Update Test Run",
    "name": "updateUsersTestRun",
    "group": "Test_Runs",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "<p>User name</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "field": "id",
            "optional": false,
            "description": "<p>Test run id</p>"
          }
        ]
      }
    },
    "description": "<p>Currently only used for updating the name,</p>",
    "examples": [
      {
        "title": "\t{",
        "content": "\"build_id\" : \"updated name\"\n}\n"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response:",
          "content": "HTTP/1.1 404 NOT FOUND\n{\n  \t\"errors\": [\n      \t\"Build can't be blank\"\n  \t]\n}\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/app/controllers/test_runs_controller.rb"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "Get a list of users",
    "name": "GetUsers",
    "group": "Users",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "<p>User name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "test_run_count",
            "optional": false,
            "description": "<p>Number of test runs owned by this user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTP/1.1 200 OK\n[{\n  \"name\": \"Jerrod\",\n  \"test_run_count\": 5\n}]\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/app/controllers/users_controller.rb"
  },
  {
    "type": "post",
    "url": "/users",
    "title": "Create a user",
    "name": "createUser",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "<p>User name</p>"
          }
        ]
      }
    },
    "description": "<p>Send the name parameter through form-data or json data</p>",
    "examples": [
      {
        "title": "Post body",
        "content": "{\n  \"name\" : \"jerrod\"\n}\n"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Sucess Response:",
          "content": "HTTP/1.1 201 CREATED\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/app/controllers/users_controller.rb"
  },
  {
    "type": "delete",
    "url": "/users/:name",
    "title": "Delete a user",
    "name": "deleteUser",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "<p>User name</p>"
          }
        ]
      }
    },
    "description": "<p>Deletes a user and all associated test runs/results</p>",
    "success": {
      "examples": [
        {
          "title": "Sucess Response:",
          "content": "HTTP/1.1 200 OK\n"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response:",
          "content": "HTTP/1.1 404 NOT FOUND\n"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/app/controllers/users_controller.rb"
  },
  {
    "type": "get",
    "url": "/users/:name",
    "title": "Get an individual user",
    "name": "getUser",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "<p>User name</p>"
          }
        ]
      }
    },
    "description": "<p>This API is deprecated. See GET /users/:name/test_runs</p>",
    "version": "0.0.0",
    "filename": "server/app/controllers/users_controller.rb"
  }
] });