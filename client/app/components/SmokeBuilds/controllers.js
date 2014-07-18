(function() {
    'use strict';
    var smokeBuildUser = 'rmauto';
    angular.module('moonunit.smokebuilds.controllers', ['windowEventBroadcasts'])
        .controller('ListSmokeBuildsCtrl', function($scope, Data, Pagination, $timeout) {
            var attempts = 0;
            $scope.loading = true;
            $scope.isSmoke = true;
            $scope.pagination = Pagination.getNew(15);
            var getBuilds = __.debounce(function() {
                Data.user({
                    username: smokeBuildUser
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
                                getBuilds();
                            }, 3001);
                        }
                    } else {
                        attempts = 0;
                    }
                });
            }, 3000, true);
            getBuilds();
            $scope.refresh = function() {
                getBuilds();
            };
            $scope.deleteRun = function(test_run) {
                Data.deleteRun({
                    username: smokeBuildUser,
                    id: test_run.id
                }, function() {
                    $scope.test_runs.splice($scope.test_runs.indexOf(test_run), 1);
                });
            };
            $scope.saveEdit = function(test_run, value) {
                return Data.updateRun({
                    username: smokeBuildUser,
                    id: test_run.id
                }, {
                    'build_id': value
                }, function() {
                    test_run.build_id = value;
                });
            };
            $scope.getPrefix = function() {
                return 'smoke-builds';
            };
            $scope.$on('$windowFocus', function() {
                getBuilds();
            });
            $scope.$on('$windowShow', function() {
                getBuilds();
            });
        })
        .controller('ShowSmokeBuildCtrl', function($scope, Data, $routeParams, Pagination) {
            $scope.loading = true;
            var getBuild = __.debounce(function() {
                Data.testRuns({
                    username: smokeBuildUser,
                    id: $routeParams.id
                }, function(smokeBuild) {
                    $scope.loading = false;
                    $scope.smokeBuild = smokeBuild;
                    $scope.data = $scope.initData = smokeBuild.test_results;
                });
            }, 10000, true);
            getBuild();
            $scope.refresh = function() {
                getBuild();
            };
            $scope.$on('$windowFocus', function() {
                getBuild();
            });
            $scope.$on('$windowShow', function() {
                getBuild();
            });
        });

})();