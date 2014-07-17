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
                    });
                    $scope.filterOptions = {
                        filterText: ''
                    };

                    $scope.aggregate = function(row) {
                        if (row.field === 'package' || row.field === 'class_name') {
                            var pass = 0,
                                fail = 0,
                                i = 0,
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
                                if (row.aggChildren[i].entity.result === 'pass') {
                                    pass++;
                                } else {
                                    fail++;
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
        });
})();