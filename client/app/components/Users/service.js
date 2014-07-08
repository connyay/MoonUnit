(function() {
    'use strict';
    angular.module('moonunit.users.data', ['ngResource'])
        .factory('Users', ['$resource',
            function($resource) {
                return $resource('/users', {}, {
                    'query': {
                        method: 'GET',
                        isArray: true
                    }
                });
            }
        ]);

})();