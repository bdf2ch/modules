"use strict";


var admControllers = angular.module("gears.admin.controllers", []);


admControllers.controller("GearsBouquetsController", ["$log", "$scope", "$flowers", "$pagination", "$misc", "$location", "$routeParams",
    function ($log, $scope, $flowers, $pagination, $misc, $location, $routeParams) {
        $scope.flowers = $flowers;
        $scope.pagination = $pagination;
        $scope.misc = $misc;

        $scope.selectReason = function (reasonId) {
            if (reasonId !== undefined) {
                $log.log("selectReason called");
                angular.forEach($misc.reasons.items, function (reason) {
                    if (reason.id.value === reasonId) {
                        if (reason._states_.selected() === false) {
                            $misc.reasons.select("id", reasonId);
                            $misc.currentReasonId = reasonId;
                            $log.log("currentReasonId = ", $misc.currentReasonId);
                        } else {
                            $misc.reasons.deselect(reason);
                            $misc.currentReasonId = 0;
                        }
                    }
                });
            }
        };

        $scope.gotoBouquet = function (bouquetId) {
            $location.url("/bouquets/" + bouquetId);
        };
    }]);


admControllers.controller("GearsBouquetController", ["$log", "$scope", "$flowers", "$pagination", "$misc", "$location", "$routeParams", "$http",
    function ($log, $scope, $flowers, $pagination, $misc, $location, $routeParams, $http) {
        $scope.flowers = $flowers;
        $scope.pagination = $pagination;
        $scope.misc = $misc;
        $scope.currentBouquet = undefined;
        $scope.activeTab = undefined;
        $scope.tabs = [
            {
                id: 1,
                title: "Информация о букете",
                template: "templates/bouquet/bouquet-info.html",
                active: true
            },
            {
                id: 2,
                title: "Поводы подарить букет",
                template: "templates/bouquet/bouquet-reasons.html",
                active: false
            },
            {
                id: 3,
                title: "Кому можно подарить букет",
                template: "templates/bouquet/bouquet-addressees.html",
                active: false
            }
        ];


        if ($routeParams.bouquetId !== undefined) {
            $scope.currentBouquet = $flowers.bouquets.find("id", parseInt($routeParams.bouquetId));
            $log.log("currentBouquet = ", $scope.currentBouquet);
        }

        $scope.selectTab = function (tabId) {
            if (tabId !== undefined) {
                angular.forEach($scope.tabs, function (tab) {
                    if (tab.id === tabId) {
                        tab.active = true;
                        $scope.activeTab = tab;
                    } else
                        tab.active = false;
                });
            }
        };

        $scope.changeReason = function (reasonId, value) {
            if (reasonId !== undefined && value !== undefined && value.constructor === Boolean) {
                var params = {
                    action: "changeReason",
                    data: {
                        bouquetId: $scope.currentBouquet.id.value,
                        reasonId: reasonId,
                        value: value === true ? 1 : 0
                    }
                };
                $scope.misc.reasons._states_.loaded(false);
                $http.post("serverside/controllers/bouquets.php", params)
                    .success(function (data) {
                        if (data !== undefined) {
                            if (JSON.parse(data) === "success") {
                                var reason = $scope.currentBouquet.reasons.find("id", reasonId);
                                if (reason !== false)
                                    reason.enabled = value;
                                else {
                                    $scope.currentBouquet.addReason(reasonId, value);
                                }
                            }
                        }
                        $scope.misc.reasons._states_.loaded(true);
                    }
                );
            }
        };


        $scope.changeAddressee = function (addresseeId, value) {
            if (addresseeId !== undefined && value !== undefined && value.constructor === Boolean) {
                var params = {
                    action: "changeAddressee",
                    data: {
                        bouquetId: $scope.currentBouquet.id.value,
                        addresseeId: addresseeId,
                        value: value === true ? 1 : 0
                    }
                };
                $scope.misc.addressees._states_.loaded(false);
                $http.post("serverside/controllers/bouquets.php", params)
                    .success(function (data) {
                        if (data !== undefined) {
                            if (JSON.parse(data) === "success") {
                                var addressee = $scope.currentBouquet.addressees.find("id", addresseeId);
                                if (addressee !== false)
                                    addressee.enabled = value;
                                else {
                                    $scope.currentBouquet.addAddressee(addresseeId, value);
                                }
                            }
                        }
                        $scope.misc.addressees._states_.loaded(true);
                    }
                );
            }
        };


    }]);

