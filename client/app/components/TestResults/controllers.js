(function() {
    'use strict';

    angular.module('moonunit.testResults.controllers', ['moonunit.testResults.data'])
        .controller('ListTestResultsCtrl', function($scope, TestResults) {
            TestResults.get({}, function(data) {
                $scope.buildID = data.build_id;
                $scope.results = data.test_results;
            });
        });

})();