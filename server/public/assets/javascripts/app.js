(function() {
    'use strict';

    angular.module('moonunit', ['ngRoute', 'templates', 'moonunit.dashboard.controllers', 'moonunit.builds', 'moonunit.testResults', 'moonunit.ui.directives'])
        .config(function($routeProvider) {
            $routeProvider
                .when('/dashboard', {
                    templateUrl: 'components/Dashboard/templates/dashboard.html',
                    controller: 'DashboardCtrl'
                })
                .otherwise({
                    redirectTo: '/dashboard'
                });
        });

})();
(function() {
    'use strict';

    angular.module('moonunit.builds.controllers', [])
        .controller('ListBuildsCtrl', function($scope) {
            
        });

})();
(function() {
    'use strict';

    angular.module('moonunit.builds', ['ngRoute', 'moonunit.builds.controllers'])
        .config(function($routeProvider) {
            $routeProvider
                .when('/builds', {
                    templateUrl: 'components/Builds/templates/builds.html',
                    controller: 'ListBuildsCtrl'
                });
        });

})();
(function() {
    'use strict';

    angular.module('moonunit.dashboard.controllers', [])
        .controller('DashboardCtrl', function($scope) {});

})();
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
(function() {
    'use strict';
    angular.module('moonunit.testResults.data', ['ngResource'])
        .factory('TestResults', ['$resource',
            function($resource) {
                return $resource('/test_runs', {
                    id: '@id'
                }, {
                    'query': {
                        method: 'GET',
                        isArray: true
                    },
                    'get': {
                        url: '/test_runs/1.json',
                        method: 'GET',
                        cache: true
                    },
                });
            }
        ]);

})();
(function() {
    'use strict';

    angular.module('moonunit.ui.directives', [])
        .directive('sideNav', function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'components/UI/side-nav.html',
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