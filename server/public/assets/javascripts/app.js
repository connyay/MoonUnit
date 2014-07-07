(function() {
    'use strict';

    angular.module('moonunit', ['ngRoute', 'templates', 'moonunit.dashboard.controllers', 'moonunit.builds', 'moonunit.testResults', 'sideNavDirective'])
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

    angular.module('moonunit.testResults.controllers', ['moonunit.testResults.data'])
        .controller('ListTestResultsCtrl', function($scope, TestResults) {
            TestResults.get({}, function(data) {
                $scope.buildID = data.build_id;
                $scope.results = data.test_results;
            });
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
                        isArray: true,
                        transformResponse: function(data) {
                            debugger;
                        }
                    },
                    'get': {
                        url: '/test_runs/1.json',
                        method: 'GET'
                    },
                });
            }
        ]);

})();
(function() {
    'use strict';

    angular.module('moonunit.dashboard.controllers', [])
        .controller('DashboardCtrl', function($scope) {});

})();
(function() {
    'use strict';

    angular.module('loadingDirective', [])
        .directive('loading', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/UI/loading.html'
            };
        });

})();
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