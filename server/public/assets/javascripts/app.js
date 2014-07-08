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

    angular.module('moonunit.testResults.controllers', ['moonunit.testResults.data', 'ngGrid'])
        .controller('ListTestResultsCtrl', function($scope, TestResults) {
            $scope.loading = true;
            $scope.config = {};
            $scope.data = [];
            TestResults.get({}, function(data) {
                $scope.buildID = data.build_id;
                //$scope.results = data.test_results;
                $scope.data = data.test_results;
                $scope.config.limitAmount = 20;
                $scope.loading = false;
            });

            $scope.addMoreItems = function() {
                $scope.config.limitAmount += 20;
            };

            $scope.gridOptions = {
                data: 'data',
                showGroupPanel: true,
                columnDefs: [{
                    field: 'package',
                    displayName: 'Package',
                    width: '**',
                }, {
                    field: 'class_name',
                    displayName: 'Class Name',
                    width: '**',
                }, {
                    field: 'name',
                    displayName: 'Test Name',
                    cellTemplate: '<div class="ngCellText colt{{$index}}" title="{{ row.entity[col.field]}}">{{ row.entity[col.field]}}</div>',
                    width: '**',
                }, {
                    field: 'time',
                    displayName: 'Time',
                    cellTemplate: '<div class="ngCellText colt{{$index}}">{{ row.entity[col.field] | number:2}} sec</div>',
                }, {
                    field: 'result',
                    displayName: 'Result',
                    cellTemplate: '<div class="ngCellText text-center colt{{$index}}"><span class="label" ng-class="{\'label-success\': row.entity[col.field] === \'pass\', \'label-danger\': row.entity[col.field] !== \'pass\'}">{{ row.entity[col.field] === \'pass\' ? \'Pass\' : \'Fail\'}}</span></div>'
                }],
                showFilter: true,
                groups: ['package']
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