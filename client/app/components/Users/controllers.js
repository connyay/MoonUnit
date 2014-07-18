(function() {
    'use strict';

    angular.module('moonunit.users.controllers', ['moonunit.data', 'moonunit.results.directives'])
        .controller('ListUsersCtrl', function($scope, Data) {
            $scope.loading = true;
            var getUsers = function() {
                Data.users({}, function(users) {
                    $scope.loading = false;
                    $scope.users = users;
                });
            };
            getUsers();
            $scope.refresh = function() {
                getUsers();
            };
        })
        .controller('ShowUserCtrl', function($scope, $routeParams, Data, Pagination, $timeout) {
            var attempts = 0;
            $scope.loading = true;
            $scope.isSmoke = false;
            $scope.pagination = Pagination.getNew(15);
            var getUser = function() {
                Data.user({
                    username: $routeParams.username
                }, function(user) {
                    $scope.loading = false;
                    $scope.user = user;
                    $scope.test_runs = user.test_runs;
                    $scope.pagination.numPages = Math.ceil($scope.test_runs.length / $scope.pagination.perPage);
                    if (user.test_runs.some(function(run) {
                        return run.locked;
                    })) {
                        if (attempts < 30) {
                            $timeout(function() {
                                getUser();
                            }, 3000);
                        }
                    } else {
                        attempts = 0;
                    }
                });
            };
            getUser();
            $scope.refresh = function() {
                getUser();
            };

            $scope.deleteRun = function(test_run) {
                Data.deleteRun({
                    username: $routeParams.username,
                    id: test_run.id
                }, function() {
                    $scope.test_runs.splice($scope.test_runs.indexOf(test_run), 1);
                });
            };
            $scope.getPrefix = function() {
                return 'users/' + $routeParams.username + '/test_runs';
            };
        })
        .controller('ShowUserResultCtrl', function($scope, $routeParams, Data) {
            $scope.user = $routeParams.username;
            $scope.loading = true;
            var getResult = function() {
                Data.testRuns({
                    username: $routeParams.username,
                    id: $routeParams.id
                }, function(result) {
                    $scope.loading = false;
                    $scope.result = result;
                    $scope.data = $scope.initData = result.test_results;
                });
            };
            getResult();
            $scope.refresh = function() {
                getResult();
            };
        });

})();