(function() {
    'use strict';
    var smokeBuildObj = {
        isSmoke: function() {
            return true;
        }
    };
    var templates = {
        users: 'components/Users/templates/users.html',
        user: 'components/Users/templates/user.html',
        result: 'components/Users/templates/user-result.html',
        result_history: 'components/Users/templates/user-result-history.html',
    };
    angular.module('moonunit.users', ['ngRoute', 'moonunit.users.controllers'])
        .config(function($routeProvider) {
            $routeProvider
                .when('/users', {
                    templateUrl: templates.users,
                    controller: 'ListCtrl'
                })
                .when('/users/:username', {
                    templateUrl: templates.user,
                    controller: 'ShowCtrl'
                })
                .when('/users/:username/test_runs/:id', {
                    templateUrl: templates.result,
                    controller: 'ShowResultCtrl'
                })
                .when('/smoke-builds', {
                    templateUrl: templates.user,
                    controller: 'ShowCtrl',
                    resolve: smokeBuildObj
                })
                .when('/smoke-builds/:id', {
                    templateUrl: templates.result,
                    controller: 'ShowResultCtrl',
                    resolve: smokeBuildObj
                })
                .when('/users/:username/test_results/:id/history', {
                    templateUrl: templates.result_history,
                    controller: 'ShowResultHistoryCtrl'
                });
        })
        .factory('isSmoke', function() {
            return false;
        });

})();
