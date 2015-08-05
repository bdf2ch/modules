"use strict";


var grUi = angular.module("gears.ui", []);


grUi.directive("tabs", ["$log", function ($log) {
    return {
        restrict: "E",
        scope: {
            caption: "@"
        },
        transclude: true,

        controller: function ($scope) {
            var tabs = $scope.tabs = [];
            //tabs.push({title: "test"});

            $scope.add = function (tab) {
                if (tab !== undefined) {
                    this.tabs.push(tab);
                }
                $log.log("tabs = ", tabs);
            };

        },

        template: "<ul>{{caption}}<li ng-repeat='tab in tabs'>{{ tab.title }}</li></ul>",
        link: function (scope, element, attributes, ctrl) {
            $log.log("TABS DIRECTIVE HERE");
            $log.log("caption = ", scope.caption);
            $log.log(ctrl);
        }
    }
}]);

grUi.directive("tab", ["$log", function ($log) {
    return {
        restrict: "E",
        require: "^tabs",
        //transclude: true,
        scope: {
            title: "@"
        },
        //template: "jhjh",
        link: function (scope, element, attributes, tabsCtrl) {
            if (tabsCtrl === undefined)
                $log.log("no tabsCtrl");

            $log.log("TAB DIRECTIVE HERE");
            tabsCtrl.add(scope);
            $log.log(scope);
        }
    }
}]);



grUi.directive("typeahead", ["$log", function ($log) {
    return {
        restrict: "E",
        scope: {
            placeholder: "@"
        },
        controller: function ($scope) {
            var label = $scope.label = "testlabel";
            var title = $scope.title = "Очистить";

            $scope.$watch("label", function (newVal, oldVal) {
               $log.log("oldVal = ", oldVal);
                $log.log("newVal = ", newVal);
                if (newVal === "") {
                    this.title = "";
                } else {
                    this.title = "Очистить";
                }
                $log.log("title = ", title);
            });

            $scope.clear = function () {
                $log.log("clear called");
                this.label = "";
            };
        },

        templateUrl: "templates/gears-ui/typeahead.html"
    }
}]);



grUi.directive("datepicker", ["$log", function ($log) {
    return {
        restrict: "E",
        scope: {},
        controller: function ($scope) {
            var now = new moment();
            var startOfMonth = moment().startOf("month");
            var endOfMonth = moment().endOf("month");
            var daysInMonth = Math.round((moment().endOf("month").unix() - moment().startOf("month").unix()) / 86400);
            var weeks = $scope.weeks = [];
            var days = $scope.days = [];

            weeks[0] = [];
            var weekIndex = 0;
            for (var i = 1; i <= daysInMonth; i++ ) {
                //var temp_day = new moment().unix();
                var day = {
                    number: i
                    //title:
                };
                weeks[weekIndex].push(day);
                if (i % 7 === 0) {
                    weekIndex++;
                    weeks[weekIndex] = [];
                    $log.log("weekIndex = ", weekIndex);
                }


                days.push(day);
            }
            $log.log("now = ", now.format("DD.MM.YYYY HH:mm"));
            $log.log("start of month = ", moment(startOfMonth).format("DD.MM.YYYY HH:mm"));
            $log.log("end of month of month = ", moment(endOfMonth).format("DD.MM.YYYY HH:mm"));
            $log.log("days in month = ", daysInMonth);
        },
        templateUrl: "templates/gears-ui/datepicker.html"
    }
}]);