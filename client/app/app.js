(function() {
    'use strict';

    angular.module('moonunit', ['ngRoute', 'templates', 'moonunit.users', 'ui.bootstrap', 'simplePagination', 'moonunit.ui.directives'])
        .config(function($routeProvider) {
            $routeProvider
                .otherwise({
                    redirectTo: '/users'
                });
        })
        .constant('SMOKE_USER', 'rmauto');

})();
