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
