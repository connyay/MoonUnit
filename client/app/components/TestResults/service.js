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