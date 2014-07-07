(function() {
    'use strict';

    angular.module('moonunit.builds', ['ngRoute', 'moonunit.builds.controllers'])
        .config(function($routeProvider) {
            $routeProvider
                .when('/builds', {
                    templateUrl: 'components/Builds/templates/builds.html',
                    controller: 'ListBuildsCtrl'
                });
        });

})();