(function() {
    'use strict';
    angular.module('moonunit.data', [])
        .factory('Data', function($http) {
            var urlBase = '/users';
            return {
                getUsers: function() {
                    return $http.get(urlBase);
                },
                getUser: function(username) {
                    return $http.get(urlBase + '/' + username);
                },
                getTestRun: function(username, testRunID) {
                    return $http.get(urlBase + '/' + username + '/test_runs/' + testRunID);
                },
                deleteTestRun: function(username, testRunID) {
                    return $http.delete(urlBase + '/' + username + '/test_runs/' + testRunID);
                },
                updateTestRun: function(username, testRunID, data) {
                    return $http.put(urlBase + '/' + username + '/test_runs/' + testRunID, data);
                }
            };
        });

})();
