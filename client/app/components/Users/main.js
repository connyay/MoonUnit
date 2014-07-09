(function() {
    'use strict';

    angular.module('moonunit.users', ['ngRoute', 'moonunit.users.controllers'])
        .config(function($routeProvider) {
            $routeProvider
                .when('/users', {
                    templateUrl: 'components/Users/templates/users.html',
                    controller: 'ListUsersCtrl'
                })
                .when('/users/:username', {
                    templateUrl: 'components/Users/templates/user.html',
                    controller: 'ShowUserCtrl'
                })
            .when('/users/:username/test_runs/:id', {
                    templateUrl: 'components/Users/templates/user-result.html',
                    controller: 'ShowUserResultCtrl'
                });
        });

})();