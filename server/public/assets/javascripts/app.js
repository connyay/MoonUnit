(function() {
    'use strict';

    angular.module('moonunit', ['ngRoute', 'templates', 'moonunit.smokebuilds', 'moonunit.users', 'ui.bootstrap', 'simplePagination', 'moonunit.ui.directives'])
        .config(function($routeProvider) {
            $routeProvider
                .otherwise({
                    redirectTo: '/users'
                });
        });

})();
(function() {
    'use strict';
    angular.module('moonunit.data', ['ngResource'])
        .factory('Data', ['$resource',
            function($resource) {
                return $resource('/users', {}, {
                    'users': {
                        method: 'GET',
                        isArray: true
                    },
                    'user': {
                        url: '/users/:username',
                        method: 'GET'
                    },
                    'testRuns': {
                        url: '/users/:username/test_runs/:id',
                        method: 'GET',
                        cache: true
                    },
                    'deleteRun': {
                        url: '/users/:username/test_runs/:id',
                        method: 'DELETE'
                    }
                });
            }
        ]);

})();
(function() {
    'use strict';

    angular.module('moonunit.results.directives', ['ngGrid'])
        .directive('resultTable', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/Results/templates/results-table.html',
                controller: function($scope, $filter) {
                    $scope.initData = [];
                    $scope.data = [];
                    $scope.passed = 0;
                    $scope.failed = 0;
                    $scope.radioFilter = 'all';
                    $scope.$watch('radioFilter', function(value) {
                        if (value === 'all') {
                            $scope.data = $scope.initData;
                            return;
                        }
                        $scope.data = $filter('filter')($scope.initData, {
                            result: value
                        });
                    });

                    $scope.$watch('data', function(data) {
                        var pass = 0,
                            fail = 0,
                            i = 0,
                            total = data.length;
                        for (i = 0; i < total; i++) {
                            if (data[i].result === 'pass') {
                                pass++;
                            } else {
                                fail++;
                            }
                        }
                        $scope.passed = pass;
                        $scope.failed = fail;
                        $scope.total = total;
                        if (!$scope.loading && !$scope.staticTotals) {
                            $scope.staticTotals = {
                                passed: pass,
                                failed: fail,
                                total: total
                            };
                        }
                    });
                    $scope.filterOptions = {
                        filterText: ''
                    };

                    $scope.aggregate = function(row) {
                        if (row.field === 'package' || row.field === 'class_name') {
                            var pass = 0,
                                fail = 0,
                                i = 0,
                                j = 0,
                                length = row.children.length;
                            for (i = 0; i < length; i++) {
                                if (row.children[i].entity.result === 'pass') {
                                    pass++;
                                } else {
                                    fail++;
                                }
                            }
                            length = row.aggChildren.length;
                            for (i = 0; i < length; i++) {
                                var aggLength = row.aggChildren[i].children.length;
                                for (j = 0; j < aggLength; j++) {
                                    if (row.aggChildren[i].children[j].entity.result === 'pass') {
                                        pass++;
                                    } else {
                                        fail++;
                                    }
                                }
                            }
                            return pass + ' Passed | ' + fail + ' Failed';
                        }
                    };
                    $scope.gridOptions = {
                        data: 'data',
                        showGroupPanel: true,
                        columnDefs: [{
                            field: 'package',
                            displayName: 'Package',
                            width: '**'
                        }, {
                            field: 'class_name',
                            displayName: 'Class Name',
                            width: '**',
                        }, {
                            field: 'name',
                            displayName: 'Test Name',
                            cellTemplate: '<div class="ngCellText colt{{$index}}" tooltip="{{ row.entity[col.field]}}" tooltip-append-to-body="true" tooltip-popup-delay="250">{{ row.entity[col.field]}}</div>',
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
                        filterOptions: $scope.filterOptions,
                        enableRowSelection: false,
                        groups: ['package'],
                        aggregateTemplate: '<div ng-click="row.toggleExpand()" ng-style="rowStyle(row)" class="ngAggregate">' +
                            '   <span class="ngAggregateText">{{row.label CUSTOM_FILTERS}} ({{row.totalChildren()}}{{AggItemsLabel}})</span><div class="text-right ngCellText">{{aggregate(row)}}</div>' +
                            '   <div class="{{row.aggClass()}}"></div>' +
                            '</div>'
                    };

                }
            };
        })
        .directive('resultsList', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/Results/templates/results-list.html',
                controller: function($scope, $modal) {
                    $scope.delete = function(test_run) {

                        var modalInstance = $modal.open({
                            templateUrl: 'result-list-modal.html',
                            controller: function($scope, $modalInstance, test_run) {
                                $scope.test_run = test_run;
                                $scope.ok = function() {
                                    $modalInstance.close(test_run);
                                };
                                $scope.cancel = function() {
                                    $modalInstance.dismiss('cancel');
                                };
                            },
                            size: 'sm',
                            resolve: {
                                'test_run': function() {
                                    return test_run;
                                }
                            }
                        });

                        modalInstance.result.then(function(test_run) {
                            $scope.deleteRun(test_run);
                        });
                    };
                }
            };
        });
})();
(function() {
    'use strict';
    var smokeBuildUser = 'rmauto';
    angular.module('moonunit.smokebuilds.controllers', [])
        .controller('ListSmokeBuildsCtrl', function($scope, Data, Pagination, $timeout) {
            var attempts = 0;
            $scope.loading = true;
            $scope.isSmoke = true;
            $scope.pagination = Pagination.getNew(15);
            var getBuilds = function() {
                Data.user({
                    username: smokeBuildUser
                }, function(user) {
                    $scope.loading = false;
                    $scope.user = user;
                    $scope.test_runs = user.test_runs;
                    $scope.pagination.numPages = Math.ceil($scope.test_runs.length / $scope.pagination.perPage);
                    if (user.test_runs.some(function(run) {
                        return run.locked;
                    })) {
                        if (attempts < 30) {
                            $timeout(function() {
                                getBuilds();
                            }, 3000);
                        }
                    } else {
                        attempts = 0;
                    }
                });
            };
            getBuilds();
            $scope.refresh = function() {
                getBuilds();
            };
            $scope.deleteRun = function(test_run) {
                Data.deleteRun({
                    username: smokeBuildUser,
                    id: test_run.id
                }, function() {
                    $scope.test_runs.splice($scope.test_runs.indexOf(test_run), 1);
                });
            };
            $scope.getPrefix = function() {
                return 'smoke-builds';
            };
        })
        .controller('ShowSmokeBuildCtrl', function($scope, Data, $routeParams, Pagination) {
            $scope.loading = true;
            var getBuild = function() {
                Data.testRuns({
                    username: smokeBuildUser,
                    id: $routeParams.id
                }, function(smokeBuild) {
                    $scope.loading = false;
                    $scope.smokeBuild = smokeBuild;
                    $scope.data = $scope.initData = smokeBuild.test_results;
                });
            };
            getBuild();
            $scope.refresh = function() {
                getBuild();
            };
        });

})();
(function() {
    'use strict';

    angular.module('moonunit.smokebuilds', ['ngRoute', 'moonunit.smokebuilds.controllers'])
        .config(function($routeProvider) {
            $routeProvider
                .when('/smoke-builds', {
                    templateUrl: 'components/SmokeBuilds/templates/smoke-builds.html',
                    controller: 'ListSmokeBuildsCtrl'
                })
                .when('/smoke-builds/:id', {
                    templateUrl: 'components/SmokeBuilds/templates/smoke-build.html',
                    controller: 'ShowSmokeBuildCtrl'
                });
        });

})();
(function() {
    'use strict';
    var defaultActiveClass = 'active';
    angular.module('moonunit.ui.directives', [])
        .directive('mainNav', function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'components/UI/main-nav.html',
                controller: function($scope) {
                    $scope.navItems = [{
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
        .directive('isActive', ['$location',
            function($location) {
                return {
                    restrict: 'A',
                    link: function($scope, element, attrs) {
                        var activeClass = attrs.activeClass || defaultActiveClass;

                        var path = attrs.route || (attrs.href || attrs.ngHref).substr(1);
                        $scope.location = $location;
                        $scope.$watch('location.path()', function(newPath) {
                            element.toggleClass(activeClass, (path === newPath));
                        });
                    }
                };
            }
        ])
        .directive('loading', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/UI/loading.html',
                link: function($scope, $element, $attrs) {
                    $scope.size = $attrs.size || 'large';
                }
            };
        })
        .directive('filter', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/UI/filter.html'
            };
        })
        .directive('moonPager', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/UI/moon-pager.html'
            };
        })
        .directive('refresh', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/UI/refresh.html'
            };
        })
        .directive("inlineEdit", function() {
            var editorTemplate = '<span ng-transclude ng-hide="view.editorEnabled"></span>' +
                '<span ng-show="view.editorEnabled">' +
                '<input ng-model="view.editableValue">' +
                '<a href ng-click="save()" title="Save"><i class="fa fa-save"></i></a>' +
                '<a href ng-click="disableEditor()" title="Cancel"><i class="fa fa-undo"></i></a>' +
                '</span>';

            return {
                restrict: "E",
                transclude: true,
                template: editorTemplate,
                controller: function($scope) {
                    $scope.view = {
                        editableValue: $scope.value,
                        editorEnabled: false
                    };

                    $scope.enableEditor = function(value) {
                        $scope.view.editorEnabled = true;
                        $scope.view.editableValue = value;
                    };

                    $scope.disableEditor = function() {
                        $scope.view.editorEnabled = false;
                    };

                    $scope.save = function() {
                        $scope.value = $scope.view.editableValue;
                        $scope.disableEditor();
                    };
                }
            };
        });
})();
(function() {
    'use strict';

    angular.module('moonunit.users.controllers', ['moonunit.data', 'moonunit.results.directives'])
        .controller('ListUsersCtrl', function($scope, Data) {
            $scope.loading = true;
            var getUsers = function() {
                Data.users({}, function(users) {
                    $scope.loading = false;
                    $scope.users = users;
                });
            };
            getUsers();
            $scope.refresh = function() {
                getUsers();
            };
        })
        .controller('ShowUserCtrl', function($scope, $routeParams, Data, Pagination, $timeout) {
            var attempts = 0;
            $scope.loading = true;
            $scope.isSmoke = false;
            $scope.pagination = Pagination.getNew(15);
            var getUser = function() {
                Data.user({
                    username: $routeParams.username
                }, function(user) {
                    $scope.loading = false;
                    $scope.user = user;
                    $scope.test_runs = user.test_runs;
                    $scope.pagination.numPages = Math.ceil($scope.test_runs.length / $scope.pagination.perPage);
                    if (user.test_runs.some(function(run) {
                        return run.locked;
                    })) {
                        if (attempts < 30) {
                            $timeout(function() {
                                getUser();
                            }, 3000);
                        }
                    } else {
                        attempts = 0;
                    }
                });
            };
            getUser();
            $scope.refresh = function() {
                getUser();
            };

            $scope.deleteRun = function(test_run) {
                Data.deleteRun({
                    username: $routeParams.username,
                    id: test_run.id
                }, function() {
                    $scope.test_runs.splice($scope.test_runs.indexOf(test_run), 1);
                });
            };
            $scope.getPrefix = function() {
                return 'users/' + $routeParams.username + '/test_runs';
            };
        })
        .controller('ShowUserResultCtrl', function($scope, $routeParams, Data) {
            $scope.user = $routeParams.username;
            $scope.loading = true;
            var getResult = function() {
                Data.testRuns({
                    username: $routeParams.username,
                    id: $routeParams.id
                }, function(result) {
                    $scope.loading = false;
                    $scope.result = result;
                    $scope.data = $scope.initData = result.test_results;
                });
            };
            getResult();
            $scope.refresh = function() {
                getResult();
            };
        });

})();
(function() {
    'use strict';

    angular.module('moonunit.users', ['ngRoute', 'moonunit.users.controllers'])
        .config(function($routeProvider) {
            $routeProvider
                .when('/users', {
                    templateUrl: 'components/Users/templates/users.html',
                    controller: 'ListUsersCtrl'
                })
                .when('/users/:username', {
                    templateUrl: 'components/Users/templates/user.html',
                    controller: 'ShowUserCtrl'
                })
            .when('/users/:username/test_runs/:id', {
                    templateUrl: 'components/Users/templates/user-result.html',
                    controller: 'ShowUserResultCtrl'
                });
        });

})();