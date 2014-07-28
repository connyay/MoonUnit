(function() {
    'use strict';

    angular.module('moonunit', ['ngRoute', 'ngAnimate', 'ngClipboard', 'templates', 'moonunit.users', 'moonunit.ui', 'ui.bootstrap', 'simplePagination'])
        .config(function($routeProvider) {
            $routeProvider
                .otherwise({
                    redirectTo: '/users'
                });
        })
        .config(['ngClipProvider',
            function(ngClipProvider) {
                ngClipProvider.setPath('assets/ZeroClipboard.swf');
            }
        ])
        .constant('SMOKE_USER', 'rmauto');

})();
