(function() {
    'use strict';
    angular.module('moonunit.data', ['ngResource'])
        .factory('Users', ['$resource',
            function($resource) {
                return $resource('/users', {}, {
                    'query': {
                        method: 'GET',
                        isArray: true
                    },
                    'get': {
                        url: '/users/:username',
                        method: 'GET'
                    },
                    'result': {
                        url: '/users/:username/test_runs/:id',
                        method: 'GET',
                        cache: true
                    },
                });
            }
        ]);

})();