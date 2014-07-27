(function() {
    'use strict';

    angular.module('moonunit', ['ngRoute', 'ngAnimate', 'templates', 'moonunit.users', 'moonunit.ui', 'ui.bootstrap', 'simplePagination'])
        .config(function($routeProvider) {
            $routeProvider
                .otherwise({
                    redirectTo: '/users'
                });
        })
        .constant('SMOKE_USER', 'rmauto');

})();
