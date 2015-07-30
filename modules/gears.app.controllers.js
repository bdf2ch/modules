"use strict";


var appControllers = angular.module("gears.app.controllers", []);

appControllers.controller("BouquetsController", ["$log", "$scope", "$application", "$flowers", "$pagination", "$misc", "$cart",
    function ($log, $scope, $application, $flowers, $pagination, $misc, $cart) {
        $scope.flowers = $flowers;
        $scope.pagination = $pagination;
        $scope.misc = $misc;
        $scope.cart = $cart;
        $scope.app = $application;


        /**
         * Выбирает текущие повод подарить букет
         * @param reasonId
         */
        $scope.selectReason = function (reasonId) {
            if (reasonId !== undefined) {
                angular.forEach($misc.reasons.items, function (reason) {
                    if (reason.id.value === reasonId) {
                        if (reason._states_.selected() === false) {
                            $misc.reasons.select("id", reasonId);
                        } else {
                            $misc.reasons.deselect(reason);
                        }
                        $application.currentReasonId = reasonId;
                    }
                });
            }
            $log.log("currentReasonId = ", $application.currentReasonId);
        };


        /**
         * Выбирает текущий диапозон цен
         * @param priceRangeId {number} - Идентификатор диапозона цен
         */
        $scope.selectPriceRange = function (priceRangeId) {
            if (priceRangeId !== undefined) {
                angular.forEach($misc.prices.items, function (priceRange) {
                    if (priceRange.id === priceRangeId)
                        $application.currentPriceRangeId = priceRange.id;
                });
                $log.log("currentPriceRangeId = ", $application.currentPriceRangeId);
            }
        };
    }]
);


appControllers.controller("CartController", ["$log", "$scope", "$cart", function ($log, $scope, $cart) {

}]);


appControllers.controller("OrderController", ["$log", "$scope", function ($log, $scope) {

}]);