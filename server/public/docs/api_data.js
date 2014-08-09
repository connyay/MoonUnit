define({ api: [
  {
    "type": "get",
    "url": "/users/:name/test_runs",
    "title": "Get a users test runs",
    "name": "getUserTestRun",
    "group": "TestRuns",
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
          "content": "HTTP/1.1 404 NOT FOUND\n{\n  \t\"error\": \"User jerrod not found\"\n}\n"
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