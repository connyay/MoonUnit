(function() {
    'use strict';

    angular.module('moonunit.ui.directives', [])
        .directive('mainNav', function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'components/UI/main-nav.html',
                controller: function($scope) {
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
            };
        })
        .directive('loading', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/UI/loading.html'
            };
        });
})();