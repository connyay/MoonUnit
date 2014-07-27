(function() {
    'use strict';

    angular.module('moonunit.users.controllers', ['moonunit.data', 'moonunit.results.directives'])
        .controller('ListCtrl', function($scope, Data) {
            $scope.loading = true;
            var getUsers = function() {
                Data.getUsers().then(function(response) {
                    $scope.loading = false;
                    $scope.users = response.data;
                });
            };
            getUsers();
            $scope.refresh = function() {
                getUsers();
            };
        })
        .controller('ShowCtrl', function($scope, $routeParams, Data, Pagination, $timeout, SMOKE_USER, isSmoke) {
            var attempts = 0;
            var username = isSmoke ? SMOKE_USER : $routeParams.username;
            $scope.loading = true;
            $scope.isSmoke = isSmoke;
            $scope.pagination = Pagination.getNew(15);
            var getUser = function() {
                Data.getUser(username).then(function(response) {
                    var user = response.data;
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
                Data.deleteTestRun(username, test_run.id)
                    .then(function() {
                        $scope.test_runs.splice($scope.test_runs.indexOf(test_run), 1);
                    });
            };
            $scope.saveEdit = function(test_run, value) {
                return Data.updateTestRun(username, test_run.id, {
                    'build_id': value
                }).then(function() {
                    test_run.build_id = value;
                });
            };
            $scope.getPrefix = function() {
                if (isSmoke) {
                    return 'smoke-builds';
                }
                return 'users/' + username + '/test_runs';
            };
        })
        .controller('ShowResultCtrl', function($scope, $routeParams, Data, SMOKE_USER, isSmoke, $filter) {
            var username = isSmoke ? SMOKE_USER : $routeParams.username;
            $scope.user = username;
            $scope.isSmoke = isSmoke;
            $scope.loading = true;
            var getResult = function() {
                Data.getTestRun(username, $routeParams.id)
                    .then(function(response) {
                        var result = response.data;
                        $scope.loading = false;
                        $scope.result = result;
                        $scope.data = $scope.initData = result.test_results;
                        $scope.date = $filter('date')(result.created_at, 'short');
                    });
            };
            getResult();
            $scope.refresh = function() {
                $scope.$emit('refresh');
                getResult();
            };
        });

})();
