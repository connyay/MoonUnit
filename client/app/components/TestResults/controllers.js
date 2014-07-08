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