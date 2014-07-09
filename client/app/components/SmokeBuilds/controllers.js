(function() {
    'use strict';

    angular.module('moonunit.smokebuilds.controllers', [])
        .controller('ListSmokeBuildsCtrl', function($scope, Data, Pagination) {
            $scope.loading = true;
            $scope.pagination = Pagination.getNew(15);
            var getBuilds = function() {
                Data.user({
                    username: 'rmauto@us.ibm.com'
                }, function(user) {
                    $scope.loading = false;
                    $scope.user = user;
                    $scope.pagination.numPages = Math.ceil($scope.user.test_runs.length / $scope.pagination.perPage);
                });
            };
            getBuilds();
            $scope.refresh = function() {
                getBuilds();
            };
        })

})();