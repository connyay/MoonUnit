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
                        title: 'Users',
                        icon: 'users',
                        route: 'users'
                    }, {
                        title: 'Smoke Builds',
                        icon: 'cloud-download',
                        route: 'smoke-builds'
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