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
            return {
                restrict: "E",
                transclude: true,
                templateUrl: 'components/UI/inline-edit.html',
                link: function($scope, $element, $attrs) {
                    var $$element = $($element);
                    $scope.$watch('view.editorEnabled', function(newValue) {
                        if (newValue) {
                            $('.inline-editor', $$element).select().focus();
                        }
                    });
                },
                controller: function($scope) {
                    $scope.view = $scope.$parent.view = {
                        editableValue: $scope.value,
                        editorEnabled: false
                    };

                    $scope.edit = function(model, value) {
                        $scope.model = model;
                        $scope.view.editorEnabled = true;
                        $scope.view.value = value;
                    };

                    $scope.disableEditor = function() {
                        $scope.view.editorEnabled = false;
                    };

                    $scope.save = function() {
                        $scope.saveEdit($scope.model, $scope.view.value).then(function() {
                            $scope.disableEditor();
                        });
                    };

                    $scope.handleKeyDown = function(event) {
                        if (event.keyCode === 27) {
                            $scope.disableEditor();
                        }
                        if (event.keyCode === 13) {
                            $scope.save();
                        }
                    };
                }
            };
        })
        .directive('resultLabel', function() {
            return {
                restrict: 'E',
                scope: {
                    result: '=result',
                    count: '=count',
                },
                templateUrl: 'components/UI/result-label.html',
                controller: function($scope, $filter) {
                    var msg;
                    if (angular.isDefined($scope.count)) {
                        msg = +$scope.count;
                        switch ($scope.result) {
                            case 'pass':
                                msg += ' Passed';
                                break;
                            case 'error':
                                msg += ' Errored';
                                break;
                            case 'fail':
                                msg += ' Failed';
                                break;
                        }
                    } else {
                        msg = $filter('capitalize')($scope.result);
                    }
                    $scope.text = msg;
                }
            };
        });
})();
