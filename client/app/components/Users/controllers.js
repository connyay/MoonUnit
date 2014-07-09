(function() {
    'use strict';

    angular.module('moonunit.users.controllers', ['moonunit.data', 'moonunit.results.directives', 'simplePagination'])
        .controller('ListUsersCtrl', function($scope, Users) {
            $scope.loading = true;
            var getUsers = function() {
                Users.query({}, function(users) {
                    $scope.loading = false;
                    $scope.users = users;
                });
            };
            getUsers();
            $scope.refresh = function() {
                getUsers();
            };
        })
        .controller('ShowUserCtrl', function($scope, $routeParams, Users, Pagination) {
            $scope.loading = true;
            $scope.pagination = Pagination.getNew(15);
            var getUser = function() {
                Users.get({
                    username: $routeParams.username
                }, function(user) {
                    $scope.loading = false;
                    $scope.user = user;
                    $scope.pagination.numPages = Math.ceil($scope.user.test_runs.length / $scope.pagination.perPage);
                });
            };
            getUser();
            $scope.refresh = function() {
                getUser();
            };
        })
        .controller('ShowUserResultCtrl', function($scope, $routeParams, Users) {
            $scope.user = $routeParams.username;
            $scope.loading = true;
            var getResult = function() {
                Users.result({
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