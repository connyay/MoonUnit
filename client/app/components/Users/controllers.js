(function() {
    'use strict';

    angular.module('moonunit.users.controllers', ['moonunit.data', 'moonunit.results.directives'])
        .controller('ListUsersCtrl', function($scope, Users) {
            var getUsers = function() {
                Users.query({}, function(users) {
                    $scope.users = users;
                });
            };
            getUsers();
            $scope.refresh = function() {
                getUsers();
            };
        })
        .controller('ShowUserCtrl', function($scope, $routeParams, Users) {
            var getUser = function() {
                Users.get({
                    username: $routeParams.username
                }, function(user) {
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