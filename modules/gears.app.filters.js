"use strict";


/********************
 * Модуль appFilters
 * Содкржит описание фильтров, используемых в приложении
 ********************/
var AppFilters = angular.module("gears.app.filters", [])
    .config(function ($filterProvider) {

        /**
         * byReason
         * Фильтр букетов по поводу подарить букет
         */
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


        /**
         * byPrice
         * Фильтр букетов по диапозону цен
         */
        $filterProvider.register("byPrice", ["$log", "$misc", function ($log, $misc) {
            return function (input, priceRangeId) {
                var result = [];
                if (priceRangeId !== undefined && priceRangeId !== 0) {
                    var price_range = $misc.prices.find("id", priceRangeId);
                    angular.forEach(input, function (bouquet) {
                        if (bouquet.price.value >= price_range.start && bouquet.price.value <= price_range.end) {
                            result.push(bouquet);
                        }
                    });
                    return result;
                } else
                    return input;
            }
        }]);

    })
    .run(function () {

    }
);