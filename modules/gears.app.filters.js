"use strict";



var AppFilters = angular.module("app.filters", [])
    .config(function ($filterProvider) {

        /* Фильтр опор по id линии */
        $filterProvider.register("pagination", [ function () {
            return function (input, itemsOnPage, pageNumber) {
                if (itemsOnPage !== undefined && pageNumber !== undefined) {
                    var items = [];
                    var start = (pageNumber * itemsOnPage) - itemsOnPage + 1;
                    angular.forEach(input, function (item, key) {
                        if (key >= start && key <= (start + itemsOnPage) - 1)
                            items.push(item);
                    });
                    return items;
                } else
                    return input;
            };
        }]);


        $filterProvider.register("byReason", ["$log", function ($log) {
            return function (input, reasonId) {
                if (reasonId !== undefined && reasonId !== 0) {
                    $console.log("reasonId = ", reasonId);
                    var result = [];
                    angular.forEach(input, function (bouquet) {
                        if (bouquet.reasons.items.length > 0) {
                            angular.forEach(bouquet.reasons.items, function (reason) {
                                $log.log("currentreason = ", reason);
                                if (reason.id.value === reasonId) {
                                    $log.log("filtered bouquet = ", bouquet);
                                    result.push(bouquet);
                                }
                            });
                        } else
                            return input;
                    });
                } else
                    return input;
                return result;
            }
        }]);

    })
    .run(function () {

    }
);