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
            return function (input, priceRangeId, exceptionBouquetId) {
                var result = [];
                if (priceRangeId !== undefined && priceRangeId !== 0) {
                    $log.log("filter price range = ", priceRangeId);
                    var price_range = $misc.prices.find("id", priceRangeId);
                    angular.forEach(input, function (bouquet) {
                        if (bouquet.price.value >= price_range.start && bouquet.price.value <= price_range.end) {
                            if (exceptionBouquetId !== undefined) {
                                if (bouquet.id.value !== exceptionBouquetId)
                                    result.push(bouquet);
                            } else
                                result.push(bouquet);
                        }
                    });
                    return result;
                } else
                    return input;
            }
        }]);



        /**
         * byFlowers
         * Фильтр букетов по входящим в состав цветам
         */
        $filterProvider.register("byFlowers", ["$log", "$misc", function ($log, $misc) {
            return function (input, flowers) {
                var result = [];
                if (flowers !== undefined && flowers.length > 0) {
                    $log.log("flowers for select = ", flowers.length);
                    angular.forEach(input, function (bouquet) {
                        var size = flowers.length;
                        var bingos = 0;

                        angular.forEach(flowers, function (flower) {

                            if (bouquet.flowers.find("flowerId", flower.id.value) !== false) {
                                bingos++;
                            }

                        });

                        if (bingos === size)
                            result.push(bouquet);
                        else {
                            angular.forEach(result, function (res, key) {
                                if (res.id.value === bouquet.id.value)
                                    result.splice(key, 1);
                            });
                        }

                    });
                    return result;
                } else
                    return input;
            }
        }]);


        $filterProvider.register("dateView", ["$log", function ($log) {
            return function (input) {
                $log.log("unix = ", input);
                $log.log("date = ", moment.unix(input).format("DD MMM YYYY, HH:mm"));
                return moment.unix(input).format("DD MMM YYYY в HH:mm");
            }
        }]);

    })
    .run(function () {

    }
);