(function() {
    'use strict';

    angular.module('moonunit', ['ngRoute', 'templates', 'moonunit.smokebuilds', 'moonunit.users', 'ui.bootstrap', 'simplePagination', 'moonunit.ui.directives'])
        .config(function($routeProvider) {
            $routeProvider
                .otherwise({
                    redirectTo: '/users'
                });
        });

})();

window.__ = {
    debounce: function(func, wait, immediate) {
        var timeout, args, context, timestamp, result;

        var later = function() {
            var last = Date.now - timestamp;
            if (last < wait) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    context = args = null;
                }
            }
        };

        return function() {
            context = this;
            args = arguments;
            timestamp = Date.now;
            var callNow = immediate && !timeout;
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }

            return result;
        };
    }
};