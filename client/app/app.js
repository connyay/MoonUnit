(function() {
    'use strict';

    angular.module('moonunit', ['ngRoute', 'templates', 'moonunit.dashboard.controllers', 'moonunit.builds', 'moonunit.testResults', 'loadingDirective', 'sideNavDirective'])
        .config(function($routeProvider) {
            $routeProvider
                .when('/dashboard', {
                    templateUrl: 'components/Dashboard/templates/dashboard.html',
                    controller: 'DashboardCtrl'
                })
                .otherwise({
                    redirectTo: '/dashboard'
                });
        });

})();