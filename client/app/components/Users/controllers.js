(function() {
    'use strict';

    angular.module('moonunit.users.controllers', ['moonunit.data', 'moonunit.results.directives'])
        .controller('ListCtrl', function($scope, Data) {
            $scope.loading = true;
            var getUsers = function() {
                Data.getUsers().success(function(users) {
                    $scope.loading = false;
                    $scope.users = users;
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
            $scope.username = username;
            $scope.loading = true;
            $scope.isSmoke = isSmoke;
            $scope.pagination = Pagination.getNew(15);
            var getUser = function() {
                Data.getUser(username).success(function(user) {
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
                    .success(function() {
                        $scope.test_runs.splice($scope.test_runs.indexOf(test_run), 1);
                    });
            };
            $scope.saveEdit = function(test_run, value) {
                return Data.updateTestRun(username, test_run.id, {
                    'build_id': value
                }).success(function() {
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
            var username = isSmoke ? SMOKE_USER : $routeParams.username,
                id = $routeParams.id;
            $scope.user = username;
            $scope.isSmoke = isSmoke;
            $scope.loading = true;
            var getResult = function() {
                Data.getTestRun(username, id)
                    .success(function(result) {
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
            $scope.getXmlLink = function() {
                return window.location.protocol + "//" + window.location.host + '/users/' + username + '/test_runs/' + id + '.xml';
            };
        }).controller('ShowResultHistoryCtrl', function($scope, $routeParams, isSmoke, Data){
            var username = isSmoke ? SMOKE_USER : $routeParams.username,
                id = $routeParams.id;

            $scope.username = username;
            var getResultHistory = function() {
                Data.getResultHistory(username, id)
                    .success(function(result_history) {
                        $scope.result_history = result_history;
                });

            };

            getResultHistory();
        });

})();
