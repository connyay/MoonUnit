(function() {
    'use strict';

    angular.module('moonunit.users.controllers', ['moonunit.users.data'])
        .controller('ListUsersCtrl', function($scope, Users) {
            Users.query({}, function(users) {
                $scope.users = users;
            })
        });

})();