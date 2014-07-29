(function() {
    'use strict';

    angular.module('moonunit.results.directives', ['ngGrid'])
        .directive('resultTable', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/Results/templates/results-table.html',
                controller: function($scope, $filter, $modal) {
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
                            controller: function($scope, $modalInstance, test) {
                                $scope.test = test;
                                $scope.modalInstance = $modalInstance;
                            },
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

                }
            };
        })
        .directive('resultsList', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/Results/templates/results-list.html',
                controller: function($scope, $modal) {
                    $scope.getXmlLink = function(test_run) {
                        return test_run.url + '.xml';
                    };
                    $scope.delete = function(test_run, ev) {
                        var modalInstance = $modal.open({
                            templateUrl: 'components/Results/templates/result-list-modal.html',
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
        })
        .directive('resultSummary', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/Results/templates/result-summary.html',
                controller: function($scope) {

                }

            };
        });
})();
