angular.module('filters', [])
    .directive('filterBox', function() {
        return {
            restrict: 'E',
            transclude: 'true',
            template:   '    <div>' + 
                        '        <div class="visibleFilters"></div>' + 
                        '        <select id="newFilter" ' + 
                        '               ng-model="selectedFilter" ' + 
                        '                ng-options="filter.title for filter in hiddenFilters" ' + 
                        '                ng-change="showFilter(selectedFilter)">' + 
                        '            <option value="">Select Filter</option>' + 
                        '        </select>' + 
                        '        <div class="hiddenFilters" ng-show="false" ng-transclude></div>' + 
                        '    </div>',
            controller: function($scope, $element) {
                $scope.hiddenFilters = [];
                $scope.visibleFilters = [];

                this.addFilter = function(filterElem) {
                    $scope.hiddenFilters.push(filterElem);
                    $scope.hiddenFilters.sort(function(a, b) { return a.title.localeCompare(b.title); })
                };

                this.hideFilter = function(filterElem)  {
                    if (!filterElem) { return; }
                    $scope.hiddenFilters.push(filterElem);
                    $scope.hiddenFilters.sort(function(a, b) { return a.title.localeCompare(b.title); })
                    $element.find('.hiddenFilters').append(filterElem);
                };

                $scope.showFilter = function(filterElem)  {
                    if (!filterElem) { return; }
                    var indexToSplice = _.indexOf($scope.hiddenFilters, filterElem);
                    $scope.hiddenFilters.splice(indexToSplice, 1);
                    $scope.visibleFilters.push(filterElem);
                    $element.find('.visibleFilters').append(filterElem);
                    $scope.selectedFilter = null;
                };

            },
        };
    })
    .directive('filter', function() {
        return {
            restrict: 'A',
            require: '^filterBox',
            transclude: 'element',
            replace: true,
            priority: 200,
            template: '<div><label>{{title}}</label><span ng-transclude></span><span ng-click="clear()">X</span></div>',
            scope: { ngModel: '=' },
            link: function(scope, iElem, iAttrs, filterBoxCtrl) {
                iElem.title = iAttrs.filterTitle;
                scope.title = iAttrs.filterTitle;
                filterBoxCtrl.addFilter(iElem);
                scope.clear = function() {
                    filterBoxCtrl.hideFilter(iElem);
                    scope.ngModel = null;
                };
            }
        };
    });