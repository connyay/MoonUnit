(function() {
    'use strict';
    var defaultActiveClass = 'active';
    angular.module('moonunit.ui.directives', [])
        .directive('mainNav', function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'components/UI/main-nav.html',
                controller: function($scope) {
                    $scope.navItems = [{
                        title: 'Users',
                        icon: 'users',
                        route: 'users'
                    }, {
                        title: 'Smoke Builds',
                        icon: 'cloud-download',
                        route: 'smoke-builds'
                    }];
                }
            };
        })
        .directive('isActive', ['$location',
            function($location) {
                return {
                    restrict: 'A',
                    link: function($scope, element, attrs) {
                        var activeClass = attrs.activeClass || defaultActiveClass;

                        var path = attrs.route || (attrs.href || attrs.ngHref).substr(1);
                        $scope.location = $location;
                        $scope.$watch('location.path()', function(newPath) {
                            element.toggleClass(activeClass, (path === newPath));
                        });
                    }
                };
            }
        ])
        .directive('loading', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/UI/loading.html',
                link: function($scope, $element, $attrs) {
                    $scope.size = $attrs.size || 'large';
                }
            };
        })
        .directive('filter', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/UI/filter.html'
            };
        })
        .directive('moonPager', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/UI/moon-pager.html'
            };
        })
        .directive('refresh', function() {
            return {
                restrict: 'E',
                templateUrl: 'components/UI/refresh.html'
            };
        })
        .directive("inlineEdit", function() {
            var editorTemplate = '<span ng-transclude ng-hide="view.editorEnabled"></span>' +
                '<span ng-show="view.editorEnabled">' +
                '<input ng-model="view.editableValue">' +
                '<a href ng-click="save()" title="Save"><i class="fa fa-save"></i></a>' +
                '<a href ng-click="disableEditor()" title="Cancel"><i class="fa fa-undo"></i></a>' +
                '</span>';

            return {
                restrict: "E",
                transclude: true,
                template: editorTemplate,
                controller: function($scope) {
                    $scope.view = {
                        editableValue: $scope.value,
                        editorEnabled: false
                    };

                    $scope.enableEditor = function(value) {
                        $scope.view.editorEnabled = true;
                        $scope.view.editableValue = value;
                    };

                    $scope.disableEditor = function() {
                        $scope.view.editorEnabled = false;
                    };

                    $scope.save = function() {
                        $scope.value = $scope.view.editableValue;
                        $scope.disableEditor();
                    };
                }
            };
        });
})();