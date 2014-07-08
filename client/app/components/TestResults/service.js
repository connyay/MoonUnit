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
                        url: '/test_runs/:id.json',
                        method: 'GET',
                        cache: true
                    },
                });
            }
        ]);

})();