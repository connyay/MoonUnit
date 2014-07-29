(function() {
    'use strict';

    angular.module('moonunit', ['ngRoute', 'ngAnimate', 'ngClipboard', 'templates', 'moonunit.users', 'moonunit.ui', 'ui.bootstrap', 'simplePagination'])
        .config(["$routeProvider", function($routeProvider) {
            $routeProvider
                .otherwise({
                    redirectTo: '/users'
                });
        }])
        .config(['ngClipProvider',
            function(ngClipProvider) {
                ngClipProvider.setPath('assets/ZeroClipboard.swf');
            }
        ])
        .constant('SMOKE_USER', 'rmauto');

})();

(function() {
    'use strict';
    angular.module('moonunit.data', [])
        .factory('Data', ["$http", function($http) {
            var urlBase = '/users';
            return {
                getUsers: function() {
                    return $http.get(urlBase);
                },
                getUser: function(username) {
                    return $http.get(urlBase + '/' + username);
                },
                getTestRun: function(username, testRunID) {
                    return $http.get(urlBase + '/' + username + '/test_runs/' + testRunID);
                },
                deleteTestRun: function(username, testRunID) {
                    return $http.delete(urlBase + '/' + username + '/test_runs/' + testRunID);
                },
                updateTestRun: function(username, testRunID, data) {
                    return $http.put(urlBase + '/' + username + '/test_runs/' + testRunID, data);
                },
                getResultHistory: function(username, testResultId){
                    return $http.get(urlBase + '/' + username + '/test_results/' + testResultId + '/history');
                },
            };
        }]);

})();

(function() {
    'use strict';

    angular.module('moonunit.results.directives', ['ngGrid'])
        .directive('resultTable', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/Results/templates/results-table.html',
                controller: ["$scope", "$filter", "$modal", function($scope, $filter, $modal) {
                    var refreshCounts = false;
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
                            error = 0,
                            i = 0,
                            total = data.length;
                        for (i = 0; i < total; i++) {
                            if (data[i].result === 'pass') {
                                pass++;
                            } else if (data[i].result === 'fail') {
                                fail++;
                            } else if (data[i].result === 'error') {
                                error++;
                            }
                        }
                        $scope.passed = pass;
                        $scope.failed = fail;
                        $scope.errored = error;
                        $scope.total = total;
                        if ((!$scope.loading && !$scope.staticTotals) || refreshCounts) {
                            $scope.staticTotals = {
                                passed: pass,
                                failed: fail,
                                total: total,
                                errored: error
                            };
                            refreshCounts = false;
                        }
                    });
                    $scope.filterOptions = {
                        filterText: ''
                    };

                    $scope.$on('refresh', function() {
                        $scope.radioFilter = 'all';
                        refreshCounts = true;
                    });

                    $scope.aggregate = function(row) {
                        if (row.field === 'package' || row.field === 'class_name') {
                            var result,
                                pass = 0,
                                fail = 0,
                                error = 0,
                                i = 0,
                                j = 0,
                                length = row.children.length;
                            for (i = 0; i < length; i++) {
                                result = row.children[i].entity.result;
                                if (result === 'pass') {
                                    pass++;
                                } else if (result === 'fail') {
                                    fail++;
                                } else if (result === 'error') {
                                    error++;
                                }
                            }
                            length = row.aggChildren.length;
                            for (i = 0; i < length; i++) {
                                var aggLength = row.aggChildren[i].children.length;
                                for (j = 0; j < aggLength; j++) {
                                    result = row.aggChildren[i].children[j].entity.result;
                                    if (result === 'pass') {
                                        pass++;
                                    } else if (result === 'fail') {
                                        fail++;
                                    } else if (result === 'error') {
                                        error++;
                                    }
                                }
                            }
                            result = [];
                            if (pass) {
                                result.push(pass + ' Passed');
                            }
                            if (fail) {
                                result.push(fail + ' Failed');
                            }
                            if (error) {
                                result.push(error + ' Errored');
                            }
                            return result.join(' | ');
                        }
                    };
                    $scope.viewLog = function(test) {
                        $modal.open({
                            templateUrl: 'components/Results/templates/log-modal.html',
                            controller: ["$scope", "$modalInstance", "test", function($scope, $modalInstance, test) {
                                $scope.test = test;
                                $scope.modalInstance = $modalInstance;
                            }],
                            resolve: {
                                'test': function() {
                                    return test;
                                }
                            },
                            size: 'lg',
                        });
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
                            cellTemplate: '<div class="ngCellText text-center colt{{$index}}">' +
                                '<span class="label" ng-class="{\'label-success\': row.entity[col.field] === \'pass\', \'label-danger\': row.entity[col.field] === \'fail\', \'label-warning\': row.entity[col.field] === \'error\'}">' +
                                '<a href ng-if="row.entity.log" title="View Log" ng-click="viewLog(row.entity)"><i class="fa fa-file-o"></i> {{row.entity[col.field] | capitalize}}</a>' +
                                '<span ng-if="!row.entity.log">{{row.entity[col.field] | capitalize}}</span>' +
                                '</span></div>'
                        }],
                        filterOptions: $scope.filterOptions,
                        enableRowSelection: false,
                        groups: ['class_name'],
                        aggregateTemplate: '<div ng-click="row.toggleExpand()" ng-style="rowStyle(row)" class="ngAggregate">' +
                            '   <span class="ngAggregateText">{{row.label CUSTOM_FILTERS}} ({{row.totalChildren()}}{{AggItemsLabel}})</span><div class="text-right ngCellText">{{aggregate(row)}}</div>' +
                            '   <div class="{{row.aggClass()}}"></div>' +
                            '</div>'
                    };

                }]
            };
        })
        .directive('resultsList', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/Results/templates/results-list.html',
                controller: ["$scope", "$modal", function($scope, $modal) {
                    $scope.getXmlLink = function(test_run) {
                        return test_run.url + '.xml';
                    };
                    $scope.delete = function(test_run, ev) {
                        var modalInstance = $modal.open({
                            templateUrl: 'components/Results/templates/result-list-modal.html',
                            controller: ["$scope", "$modalInstance", "test_run", function($scope, $modalInstance, test_run) {
                                $scope.test_run = test_run;
                                $scope.ok = function() {
                                    $modalInstance.close(test_run);
                                };
                                $scope.cancel = function() {
                                    $modalInstance.dismiss('cancel');
                                };
                            }],
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
                }]
            };
        })
        .directive('resultSummary', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/Results/templates/result-summary.html',
                controller: ["$scope", function($scope) {

                }]

            };
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
                controller: ["$scope", function($scope) {
                    $scope.navItems = [{
                        title: 'Users',
                        icon: 'users',
                        route: 'users'
                    }, {
                        title: 'Smoke Builds',
                        icon: 'cloud-download',
                        route: 'smoke-builds'
                    }];
                }]
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
                controller: ["$scope", function($scope) {
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
                        $scope.saveEdit($scope.model, $scope.view.value).then(function() {
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
                }]
            };
        });
})();

(function() {
    'use strict';
    angular.module('moonunit.ui.filters', [])
        .filter('capitalize', function() {
            return function(input, scope) {
                return input.substring(0, 1).toUpperCase() + input.substring(1);
            };
        });
})();

(function() {
    'use strict';
    angular.module('moonunit.ui', ['moonunit.ui.directives', 'moonunit.ui.filters']);
})();

(function() {
    'use strict';

    angular.module('moonunit.users.controllers', ['moonunit.data', 'moonunit.results.directives'])
        .controller('ListCtrl', ["$scope", "Data", function($scope, Data) {
            $scope.loading = true;
            var getUsers = function() {
                Data.getUsers().success(function(users) {
                    $scope.loading = false;
                    $scope.users = users;
                });
            };
            getUsers();
            $scope.refresh = function() {
                getUsers();
            };
        }])
        .controller('ShowCtrl', ["$scope", "$routeParams", "Data", "Pagination", "$timeout", "SMOKE_USER", "isSmoke", function($scope, $routeParams, Data, Pagination, $timeout, SMOKE_USER, isSmoke) {
            var attempts = 0;
            var username = isSmoke ? SMOKE_USER : $routeParams.username;
            $scope.loading = true;
            $scope.isSmoke = isSmoke;
            $scope.pagination = Pagination.getNew(15);
            var getUser = function() {
                Data.getUser(username).success(function(user) {
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
                Data.deleteTestRun(username, test_run.id)
                    .success(function() {
                        $scope.test_runs.splice($scope.test_runs.indexOf(test_run), 1);
                    });
            };
            $scope.saveEdit = function(test_run, value) {
                return Data.updateTestRun(username, test_run.id, {
                    'build_id': value
                }).success(function() {
                    test_run.build_id = value;
                });
            };
            $scope.getPrefix = function() {
                if (isSmoke) {
                    return 'smoke-builds';
                }
                return 'users/' + username + '/test_runs';
            };
        }])
        .controller('ShowResultCtrl', ["$scope", "$routeParams", "Data", "SMOKE_USER", "isSmoke", "$filter", function($scope, $routeParams, Data, SMOKE_USER, isSmoke, $filter) {
            var username = isSmoke ? SMOKE_USER : $routeParams.username,
                id = $routeParams.id;
            $scope.user = username;
            $scope.isSmoke = isSmoke;
            $scope.loading = true;
            var getResult = function() {
                Data.getTestRun(username, id)
                    .success(function(result) {
                        $scope.loading = false;
                        $scope.result = result;
                        $scope.data = $scope.initData = result.test_results;
                        $scope.date = $filter('date')(result.created_at, 'short');
                    });
            };
            getResult();
            $scope.refresh = function() {
                $scope.$emit('refresh');
                getResult();
            };
            $scope.getXmlLink = function() {
                return window.location.protocol + "//" + window.location.host + '/users/' + username + '/test_runs/' + id + '.xml';
            };
        }]).controller('ShowResultHistoryCtrl', ["$scope", "$routeParams", "isSmoke", "Data", function($scope, $routeParams, isSmoke, Data){
            var username = isSmoke ? SMOKE_USER : $routeParams.username,
                id = $routeParams.id;
            var getResultHistory = function() {
                Data.getResultHistory(username, id)
                    .success(function(result_history) {
                        $scope.result_history = result_history;
                });

            };

            getResultHistory();
        }]);

})();

(function() {
    'use strict';
    var smokeBuildObj = {
        isSmoke: function() {
            return true;
        }
    };
    var templates = {
        users: 'components/Users/templates/users.html',
        user: 'components/Users/templates/user.html',
        result: 'components/Users/templates/user-result.html',
        result_history: 'components/Users/templates/user-result-history.html',
    };
    angular.module('moonunit.users', ['ngRoute', 'moonunit.users.controllers'])
        .config(["$routeProvider", function($routeProvider) {
            $routeProvider
                .when('/users', {
                    templateUrl: templates.users,
                    controller: 'ListCtrl'
                })
                .when('/users/:username', {
                    templateUrl: templates.user,
                    controller: 'ShowCtrl'
                })
                .when('/users/:username/test_runs/:id', {
                    templateUrl: templates.result,
                    controller: 'ShowResultCtrl'
                })
                .when('/smoke-builds', {
                    templateUrl: templates.user,
                    controller: 'ShowCtrl',
                    resolve: smokeBuildObj
                })
                .when('/smoke-builds/:id', {
                    templateUrl: templates.result,
                    controller: 'ShowResultCtrl',
                    resolve: smokeBuildObj
                })
                .when('/users/:username/test_results/:id/history', {
                    templateUrl: templates.result_history,
                    controller: 'ShowResultHistoryCtrl'
                });
        }])
        .factory('isSmoke', function() {
            return false;
        });

})();
