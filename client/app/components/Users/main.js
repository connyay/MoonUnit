(function() {
    'use strict';

    angular.module('moonunit.users', ['ngRoute', 'moonunit.users.controllers'])
        .config(function($routeProvider) {
            $routeProvider
                .when('/users', {
                    templateUrl: 'components/Users/templates/users.html',
                    controller: 'ListUsersCtrl'
                });
        });

})();