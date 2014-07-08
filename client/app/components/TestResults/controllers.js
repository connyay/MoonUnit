(function() {
    'use strict';

    angular.module('moonunit.testResults.controllers', ['moonunit.testResults.data'])
        .controller('ListTestResultsCtrl', function($scope, TestResults, $timeout) {
            $scope.loading = true;
            var getData = function() {
                TestResults.get({}, function(data) {
                    $scope.buildID = data.build_id;
                    $scope.results = data.test_results;
                    $scope.loading = false;
                });
            };
            $timeout(getData, 0);

        });

})();