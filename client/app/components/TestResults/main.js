(function() {
    'use strict';

    angular.module('moonunit.testResults', ['ngRoute', 'moonunit.testResults.controllers'])
        .config(function($routeProvider) {
            $routeProvider
                .when('/test-results', {
                    templateUrl: 'components/TestResults/templates/test-results.html',
                    controller: 'ListTestResultsCtrl'
                });
        });

})();