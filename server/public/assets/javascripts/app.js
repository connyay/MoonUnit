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

window.__ = {
    debounce: function(func, wait, immediate) {
        var timeout, args, context, timestamp, result;

        var later = function() {
            var last = Date.now - timestamp;
            if (last < wait) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    context = args = null;
                }
            }
        };

        return function() {
            context = this;
            args = arguments;
            timestamp = Date.now;
            var callNow = immediate && !timeout;
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }

            return result;
        };
    }
};
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
                        method: 'GET'
                    },
                    'deleteRun': {
                        url: '/users/:username/test_runs/:id',
                        method: 'DELETE'
                    },
                    'updateRun': {
                        url: '/users/:username/test_runs/:id',
                        method: 'PUT'
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
                    $scope.delete = function(test_run, ev) {
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
    angular.module('moonunit.smokebuilds.controllers', ['windowEventBroadcasts'])
        .controller('ListSmokeBuildsCtrl', function($scope, Data, Pagination, $timeout) {
            var attempts = 0;
            $scope.loading = true;
            $scope.isSmoke = true;
            $scope.pagination = Pagination.getNew(15);
            var getBuilds = __.debounce(function() {
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
                            }, 3001);
                        }
                    } else {
                        attempts = 0;
                    }
                });
            }, 3000, true);
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
            $scope.saveEdit = function(test_run, value) {
                return Data.updateRun({
                    username: smokeBuildUser,
                    id: test_run.id
                }, {
                    'build_id': value
                }, function() {
                    test_run.build_id = value;
                });
            };
            $scope.getPrefix = function() {
                return 'smoke-builds';
            };
            $scope.$on('$windowFocus', function() {
                getBuilds();
            });
            $scope.$on('$windowShow', function() {
                getBuilds();
            });
        })
        .controller('ShowSmokeBuildCtrl', function($scope, Data, $routeParams, Pagination) {
            $scope.loading = true;
            var getBuild = __.debounce(function() {
                Data.testRuns({
                    username: smokeBuildUser,
                    id: $routeParams.id
                }, function(smokeBuild) {
                    $scope.loading = false;
                    $scope.smokeBuild = smokeBuild;
                    $scope.data = $scope.initData = smokeBuild.test_results;
                });
            }, 10000, true);
            getBuild();
            $scope.refresh = function() {
                getBuild();
            };
            $scope.$on('$windowFocus', function() {
                getBuild();
            });
            $scope.$on('$windowShow', function() {
                getBuild();
            });
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
            return {
                restrict: "E",
                transclude: true,
                templateUrl: 'components/UI/inline-edit.html',
                link: function($scope, $element, $attrs) {
                    var $$element = $($element);
                    $scope.$watch('view.editorEnabled', function(newValue) {
                        if (newValue) {
                            $('.inline-editor', $$element).select().focus();
                        }
                    });
                },
                controller: function($scope) {
                    $scope.view = $scope.$parent.view = {
                        editableValue: $scope.value,
                        editorEnabled: false
                    };

                    $scope.edit = function(model, value) {
                        $scope.model = model;
                        $scope.view.editorEnabled = true;
                        $scope.view.value = value;
                    };

                    $scope.disableEditor = function() {
                        $scope.view.editorEnabled = false;
                    };

                    $scope.save = function() {
                        $scope.saveEdit($scope.model, $scope.view.value).$promise.then(function() {
                            $scope.disableEditor();
                        });
                    };

                    $scope.handleKeyDown = function(event) {
                        if (event.keyCode === 27) {
                            $scope.disableEditor();
                        }
                        if (event.keyCode === 13) {
                            $scope.save();
                        }
                    };
                }
            };
        });
})();
(function() {
    'use strict';

    angular.module('moonunit.users.controllers', ['moonunit.data', 'moonunit.results.directives', 'windowEventBroadcasts'])
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
            var username = $routeParams.username;
            $scope.loading = true;
            $scope.isSmoke = false;
            $scope.pagination = Pagination.getNew(15);
            var getUser = __.debounce(function() {
                Data.user({
                    username: username
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
            }, 3000, true);
            getUser();
            $scope.refresh = function() {
                getUser();
            };

            $scope.deleteRun = function(test_run) {
                Data.deleteRun({
                    username: username,
                    id: test_run.id
                }, function() {
                    $scope.test_runs.splice($scope.test_runs.indexOf(test_run), 1);
                });
            };
            $scope.saveEdit = function(test_run, value) {
                return Data.updateRun({
                    username: username,
                    id: test_run.id
                }, {
                    'build_id': value
                }, function() {
                    test_run.build_id = value;
                });
            };
            $scope.getPrefix = function() {
                return 'users/' + username + '/test_runs';
            };
            $scope.$on('$windowFocus', function() {
                getUser();
            });
            $scope.$on('$windowShow', function() {
                getUser();
            });
        })
        .controller('ShowUserResultCtrl', function($scope, $routeParams, Data) {
            $scope.user = $routeParams.username;
            $scope.loading = true;
            var getResult = __.debounce(function() {
                Data.testRuns({
                    username: $routeParams.username,
                    id: $routeParams.id
                }, function(result) {
                    $scope.loading = false;
                    $scope.result = result;
                    $scope.data = $scope.initData = result.test_results;
                });
            }, 10000, true);
            getResult();
            $scope.refresh = function() {
                getResult();
            };
            $scope.$on('$windowFocus', function() {
                getResult();
            });
            $scope.$on('$windowShow', function() {
                getResult();
            });
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