(function() {
    'use strict';

    angular.module('moonunit.smokebuilds', ['ngRoute', 'moonunit.smokebuilds.controllers'])
        .config(function($routeProvider) {
            $routeProvider
                .when('/smoke-builds', {
                    templateUrl: 'components/SmokeBuilds/templates/smoke-builds.html',
                    controller: 'ListSmokeBuildsCtrl'
                })
                .when('/smoke-builds/:id', {
                    templateUrl: 'components/SmokeBuilds/templates/smoke-build.html',
                    controller: 'ShowSmokeBuildCtrl'
                });
        });

})();