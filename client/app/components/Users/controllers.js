(function() {
    'use strict';

    angular.module('moonunit.users.controllers', ['moonunit.data', 'moonunit.results.directives'])
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
        .controller('ShowUserCtrl', function($scope, $routeParams, Users) {
            $scope.loading = true;
            var getUser = function() {
                Users.get({
                    username: $routeParams.username
                }, function(user) {
                    $scope.loading = false;
                    $scope.user = user;
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