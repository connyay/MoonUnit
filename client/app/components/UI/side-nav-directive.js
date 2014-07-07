(function() {
    'use strict';

    angular.module('sideNavDirective', [])
        .directive('sideNav', function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'components/UI/side-nav.html',
                controller: 'NavCtrl'
            };
        })
        .controller('NavCtrl', ['$scope', '$location',
            function($scope, $location) {
                // Items to show in the side navigation.
                // Object with a title and route property. If no route
                // is provided the lowercase'd title will be used
                $scope.navItems = [{
                    title: 'Dashboard',
                    route: 'dashboard',
                    icon: 'dashboard',
                }, {
                    title: 'Builds',
                    icon: 'shield',
                    route: 'builds'
                }, {
                    title: 'Test Results',
                    icon: 'gavel',
                    route: 'test-results'
                }];
            }
        ]);

})();