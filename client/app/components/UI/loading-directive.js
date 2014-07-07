(function() {
    'use strict';

    angular.module('loadingDirective', [])
        .directive('loading', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/UI/loading.html'
            };
        });

})();