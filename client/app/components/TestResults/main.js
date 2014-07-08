(function() {
    'use strict';

    angular.module('moonunit.testResults', ['ngRoute', 'moonunit.testResults.controllers', 'moonunit.testResults.data'])
        .config(function($routeProvider) {
            $routeProvider
                .when('/test-results', {
                    templateUrl: 'components/TestResults/templates/test-results.html',
                    controller: 'ListTestResultsCtrl'
                });
        });

})();