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
         * �������� ������� ����� �������� �����
         * @param reasonId
         */
        $scope.selectReason = function (reasonId) {
            if (reasonId !== undefined) {
                angular.forEach($misc.reasons.items, function (reason) {
                    if (reason.id.value === reasonId) {
                        if (reason._states_.selected() === false) {
                            $misc.reasons.select("id", reasonId);
                            $application.currentReasonId = reasonId;
                        } else {
                            $misc.reasons.deselect(reason);
                            $application.currentReasonId = 0;
                        }
                    }
                });
            }
            $log.log("currentReasonId = ", $application.currentReasonId);
        };


        $scope.selectAddressee = function (addresseeId) {
            if (addresseeId !== undefined) {
                angular.forEach($misc.addressees.items, function (addressee) {
                    if (addressee.id.value === addresseeId) {
                        if (addressee._states_.selected() === false) {
                            $misc.addressees.select("id", addresseeId);
                            $application.currentAddresseeId = addresseeId;
                        } else {
                            $misc.addressees.deselect(addressee);
                            $application.currentAddresseeId = 0;
                        }
                    }
                });
            }
            $log.log("currentAddresseeId = ", $application.currentAddresseeId);
        };


        /**
         * �������� ������� �������� ���
         * @param priceRangeId {number} - ������������� ��������� ���
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


appControllers.controller("BouquetController", ["$log", "$scope", "$cart", function ($log, $scope, $cart) {
    $scope.cart = $cart;
}]);


appControllers.controller("CartController", ["$log", "$scope", "$cart", "$flowers", function ($log, $scope, $cart, $flowers) {
    $scope.flowers = $flowers;
    $log.log($cart.items);
}]);


appControllers.controller("OrderController", ["$log", "$scope", function ($log, $scope) {

}]);