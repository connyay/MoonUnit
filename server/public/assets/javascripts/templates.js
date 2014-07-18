angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("components/UI/filter.html","<form class=\"form-inline pull-right\" name=\"form\" role=\"form\">\n    <input type=\"text\" class=\"form-control input-sm\" ng-model=\"filterText\" placeholder=\"Filter\">\n</form>");
$templateCache.put("components/UI/loading.html","<div class=\"text-center m\" ng-if=\"size === \'large\'\">\n    <i class=\"fa fa-spinner fa-3x fa-spin\"></i>\n</div>\n\n<i class=\"fa fa-spinner fa-spin\" ng-if=\"size === \'small\' && loading\"></i>");
$templateCache.put("components/UI/main-nav.html","<nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n    <div class=\"container\">\n        <div class=\"navbar-header\">\n            <button type=\"button\" class=\"navbar-toggle\" ng-click=\"isCollapsed = !isCollapsed\" ng-init=\"isCollapsed = true\">\n                <span class=\"sr-only\">Toggle navigation</span>\n                <span class=\"icon-bar\"></span>\n                <span class=\"icon-bar\"></span>\n                <span class=\"icon-bar\"></span>\n            </button>\n            <a class=\"navbar-brand\" href=\"#\"><i class=\"fa fa-moon-o\"></i> MoonUnit</a>\n        </div>\n\n        <div class=\"collapse navbar-collapse\" collapse=\"isCollapsed\">\n            <ul class=\"nav navbar-nav navbar-right\">\n                <li ng-repeat=\"item in navItems\" is-active route=\"/{{item.route}}\">\n                    <a href=\"#{{item.route}}\" title=\"{{item.title}}\"><i class=\"fa fa-{{item.icon}}\"></i> {{item.title}}</a>\n                </li>\n            </ul>\n        </div>\n    </div>\n</nav>");
$templateCache.put("components/UI/moon-pager.html","<div class=\"text-center\" ng-if=\"!loading && !filterText && pagination.numPages > 1\">\n    <ul class=\"pagination\">\n        <li ng-click=\"pagination.prevPage()\" ng-class=\"{disabled: pagination.page === 0}\">\n            <a href>&laquo;</a>\n        </li>\n        <li ng-repeat=\"n in [] | range: pagination.numPages\" ng-class=\"{active: n == pagination.page}\">\n            <a ng-click=\"pagination.toPageId(n)\">{{n + 1}}</a>\n        </li>\n        <li ng-click=\"pagination.nextPage()\" ng-class=\"{disabled: pagination.page + 1 >= pagination.numPages}\">\n            <a href>&raquo;</a>\n        </li>\n    </ul>\n</div>");
$templateCache.put("components/UI/refresh.html","<button type=\"button\" class=\"btn btn-primary btn-sm pull-right\" ng-click=\"refresh()\">\n    <span class=\"fa fa-refresh\"></span>\n</button>");
$templateCache.put("components/Results/templates/results-list.html","<script type=\"text/ng-template\" id=\"result-list-modal.html\">\n    <div class=\"modal-header\">\n        <h3 class=\"modal-title\">Are you sure?</h3>\n    </div>\n    <div class=\"modal-body\">\n        Are you sure you want to delete {{test_run.build_id}}?\n    </div>\n    <div class=\"modal-footer\">\n        <button class=\"btn btn-primary\" ng-click=\"ok()\">Yes</button>\n        <button class=\"btn btn-warning\" ng-click=\"cancel()\">No</button>\n    </div>\n</script>\n<loading ng-if=\"loading\"></loading>\n<ul class=\"list-unstyled\" ng-if=\"!loading\">\n    <li ng-repeat=\"test_run in test_runs | filter:filterText | startFrom: filterText ? 0 : pagination.page * pagination.perPage | limitTo: pagination.perPage\">\n        <h4>\n            <span ng-if=\"!test_run.locked\">\n                <span class=\"dropdown\" on-toggle=\"toggled(open)\">\n                    <button type=\"button\" class=\"btn btn-link btn-xs dropdown-toggle\"><i class=\"fa fa-caret-down\"></i>\n                    </button>\n                    <ul class=\"dropdown-menu\">\n                        <li><a href ng-click=\"enableEditor(test_run.build_id)\"><i class=\"fa fa-pencil\"></i> Edit</a>\n                        </li>\n                        <li><a href ng-click=\"delete(test_run)\"><i class=\"fa fa-trash-o\"></i> Delete</a>\n                        </li>\n                    </ul>\n                </span>\n                <inline-edit><a ng-href=\"#/{{getPrefix()}}/{{test_run.id}}\">{{test_run.build_id}}</a>\n                </inline-edit>\n            </span>\n            <span class=\"disabled\" ng-if=\"test_run.locked\">{{test_run.build_id}}</span>\n            <small>({{test_run.created_at | date:\'short\'}})</small>\n        </h4>\n    </li>\n    <li ng-if=\"!loading && !user.test_runs.length\">No builds found</li>\n</ul>");
$templateCache.put("components/Results/templates/results-table.html","<div class=\"row\">\n    <div class=\"col-lg-10 col-md-7 col-sm-6 col-xs-6\">\n        <div class=\"btn-group\">\n            <label class=\"btn btn-default btn-sm\" ng-model=\"radioFilter\" btn-radio=\"\'all\'\">{{!loading ? staticTotals.total : \'\'}} All</label>\n            <label class=\"btn btn-success btn-sm\" ng-model=\"radioFilter\" btn-radio=\"\'pass\'\">{{!loading ? staticTotals.passed : \'\'}} Passed</label>\n            <label class=\"btn btn-danger btn-sm\" ng-model=\"radioFilter\" btn-radio=\"\'fail\'\">{{!loading ? staticTotals.failed : \'\'}} Failed</label>\n        </div>\n    </div>\n    <div class=\"col-lg-2 col-md-5 col-sm-6 col-xs-6\">\n        <input type=\"text\" class=\"form-control input-sm\" ng-model=\"filterOptions.filterText\" placeholder=\"Filter\">\n    </div>\n</div>\n<br>\n<loading ng-if=\"loading\"></loading>\n\n<div class=\"progress\" ng-if=\"!loading\">\n    <div class=\"progress-bar progress-bar-danger\" style=\"width: {{(failed / total) * 100}}%\" tooltip=\"{{failed}} Failed\">\n    </div>\n    <div class=\"progress-bar progress-bar-success\" style=\"width: {{(passed / total) * 100}}%\" tooltip=\"{{passed}} Passed\">\n    </div>\n</div>\n<div class=\"test-results\" ng-grid=\"gridOptions\" ng-if=\"!loading\"></div>");
$templateCache.put("components/SmokeBuilds/templates/smoke-build.html","<ol class=\"breadcrumb\">\n    <li><a href=\"#/smoke-builds\">Smoke Builds</a>\n    </li>\n    <li class=\"active\">{{smokeBuild.build_id}}\n        <loading size=\"small\"></loading>\n    </li>\n</ol>\n<div class=\"page-header\">\n    <h2>Smoke Build\n        <small>{{smokeBuild.build_id}}</small>\n    </h2>\n</div>\n\n<result-table></result-table>");
$templateCache.put("components/SmokeBuilds/templates/smoke-builds.html","<ol class=\"breadcrumb\">\n    <li class=\"active\">Smoke Builds</li>\n</ol>\n<h1 class=\"page-header\">\n    <refresh></refresh>Smoke Builds</h1>\n\n<filter></filter>\n\n<results-list></results-list>\n\n<moon-pager></moon-pager>");
$templateCache.put("components/Users/templates/user-result.html","<ol class=\"breadcrumb\">\n    <li><a href=\"#/users\">Users</a>\n    </li>\n    <li><a href=\"#/users/{{user}}\">{{user}}</a>\n    </li>\n    <li class=\"active\">{{result.build_id}}\n        <loading size=\"small\"></loading>\n    </li>\n</ol>\n<div class=\"page-header\">\n    <h2>Test Results\n        <small>{{result.build_id}}</small>\n    </h2>\n</div>\n\n<result-table></result-table>");
$templateCache.put("components/Users/templates/user.html","<ol class=\"breadcrumb\">\n    <li><a href=\"#/users\">Users</a>\n    </li>\n    <li class=\"active\">{{user.name}}</li>\n</ol>\n<div class=\"page-header\">\n    <refresh></refresh>\n    <h2>User\n        <small>{{user.name}}</small>\n    </h2>\n</div>\n\n<filter></filter>\n\n<results-list></results-list>\n\n<moon-pager></moon-pager>");
$templateCache.put("components/Users/templates/users.html","<ol class=\"breadcrumb\">\n    <li class=\"active\">Users</li>\n</ol>\n<div class=\"page-header\">\n    <refresh></refresh>\n    <h2>Users</h2>\n</div>\n\n<filter></filter>\n\n<ul class=\"list-unstyled\">\n    <li ng-repeat=\"user in users | filter:filterText\">\n        <h4><a ng-href=\"#/users/{{user.name}}\">{{user.name}}</a>\n            <small ng-if=\"user.test_runs.length\">\n                <ng-pluralize count=\"user.test_runs.length\" when=\"{\n                     \'one\': \'(1 build)\',\n                     \'other\': \'({} builds)\'}\">\n                </ng-pluralize>\n            </small>\n        </h4>\n    </li>\n</ul>");}]);