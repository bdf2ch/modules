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
                    console.log("reasonId = ", reasonId);
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
         * byAddressee
         * Фильтр букетов по поводу подарить букет
         */
        $filterProvider.register("byAddressee", ["$log", function ($log) {
            return function (input, addresseeId) {
                if (addresseeId !== undefined && addresseeId !== 0) {
                    console.log("addresseeId = ", addresseeId);
                    var result = [];
                    angular.forEach(input, function (bouquet) {
                        if (bouquet.addressees.items.length > 0) {
                            angular.forEach(bouquet.addressees.items, function (addressee) {
                                $log.log("currentaddressee = ", addressee);
                                if (addressee.id.value === addresseeId) {
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
        $filterProvider.register("byPrice", ["$log", "$misc", "$pagination", function ($log, $misc, $pagination) {
            return function (input, priceRangeId) {
                var result = [];
                if (priceRangeId !== undefined && priceRangeId !== 0) {
                    $log.log("filter price range = ", priceRangeId);
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