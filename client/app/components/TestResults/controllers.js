(function() {
    'use strict';

    angular.module('moonunit.testResults.controllers', ['moonunit.testResults.data', 'infinite-scroll'])
        .controller('ListTestResultsCtrl', function($scope, TestResults) {
            $scope.loading = true;
            $scope.config = {};
            TestResults.get({}, function(data) {
                $scope.buildID = data.build_id;
                $scope.results = data.test_results;
                $scope.config.limitAmount = 20;
                $scope.loading = false;
            });

            $scope.addMoreItems = function() {
                $scope.config.limitAmount += 20;
            };

        });

})();