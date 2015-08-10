"use strict";


var  gears = angular.module("gears.admin", [
    "ngRoute",
    "ngCookies",
    "gears",
    "gears.ui",
    "gears.auth",
    "gears.admin.controllers",
    "gears.admin.filters",
    "gears.app.bouquets",
    "gears.app.orders",
    "gears.app.misc"])
    .config(function ($provide, $routeProvider) {

        $routeProvider
            .when("/", {
                templateUrl: "templates/bouquets/bouquets.html",
                controller: "GearsBouquetsController"})
            .when("/bouquets/:bouquetId", {
                templateUrl: "templates/bouquet/bouquet.html",
                controller: "GearsBouquetController"})
            .when("/flowers", {
                templateUrl: "templates/flowers/flowers.html",
                controller: "GearsFlowersController"})
            .when("/new-flower", {
                templateUrl: "templates/flowers/add-flower.html",
                controller: "GearsAddFlowerController"})
            .when("/new-bouquet", {
                templateUrl: "templates/bouquet/add-bouquet.html",
                controller: "GearsAddBouquetController"})
            .when("/additions", {
                templateUrl: "templates/additions/additions.html",
                controller: "GearsAdditionsController"})
            .when("/new-addition", {
                templateUrl: "templates/additions/add-addition.html",
                controller: "GearsAddAdditionController"})
            .when("/orders", {
                templateUrl: "templates/orders/orders.html",
                controller: "GearsOrdersController"})
            .otherwise({ redirectTo: '/' });

        /**
         * $gears
         * Сервис административной панели
         */
        $provide.factory("$admin", ["$log", "$http", "$factory", "$flowers", "$misc", function ($log, $http, $factory, $flowers, $misc) {
            var application = {};

            application.title = "Gears test application";
            application.currentFlowerId = 0;
            application.currentAdditionId = 0;


            flowers.init = function () {
                $http.post("serverside/controllers/init.php", {})
                    .success(function (data) {
                        if (data !== undefined) {

                            /* Р�РЅРёС†РёР°Р»РёР·Р°С†РёСЏ РјР°СЃСЃРёРІР° С†РІРµС‚РѕРІ */
                            if (data["flowers"] !== undefined) {
                                angular.forEach(data["flowers"], function (flower) {
                                    var temp_flower = $factory({ classes: ["Flower", "Model", "States"], base_class: "Flower"});
                                    temp_flower._model_.fromJSON(flower);
                                    flowers.flowers.append(temp_flower);
                                });
                                $log.log("flowers = ", flowers.flowers.items);
                            }

                            /* Р�РЅРёС†РёР°Р»РёР·Р°С†РёСЏ РјР°СЃСЃРёРІР° РґРµРєРѕСЂР°С‚РёРІРЅС‹С… РѕС„РѕСЂРјР»РµРЅРёР№ */
                            if (data["additions"] !== undefined) {
                                angular.forEach(data["additions"], function (addition) {
                                    var temp_addition = $factory({ classes: ["Addition", "Model"], base_class: "Addition"});
                                    temp_addition._model_.fromJSON(addition);
                                    flowers.additions.append(temp_addition);
                                });
                                $log.log("additions = ", flowers.additions.items);
                            }

                            /* Р�РЅРёС†РёР°Р»РёР·Р°С†РёСЏ РјР°СЃСЃРёРІР° Р±СѓРєРµС‚РѕРІ */
                            if (data["bouquets"] !== undefined) {
                                angular.forEach(data["bouquets"], function (bouquet) {
                                    var temp_bouquet = $factory({ classes: ["Bouquet", "Model", "Backup"], base_class: "Bouquet"});
                                    temp_bouquet._model_.fromJSON(bouquet);
                                    temp_bouquet._backup_.setup();

                                    if (bouquet["flowers"] !== undefined) {
                                        angular.forEach(bouquet["flowers"], function (flower) {
                                            var flower_id = parseInt(flower["id"]);
                                            temp_bouquet.addFlower(flower_id);
                                        });
                                    }

                                    if (bouquet["additions"] !== undefined) {
                                        angular.forEach(bouquet["additions"], function (addition) {
                                            var addition_id = parseInt(addition["id"]);
                                            temp_bouquet.addAddition(addition_id);
                                        });
                                    }

                                    flowers.bouquets.append(temp_bouquet);
                                });
                                $log.log("bouquets = ", flowers.bouquets.items);
                                $pagination.init({
                                    itemsOnPage: 12,
                                    itemsCount: flowers.bouquets.size()
                                });
                            }

                            /* Р�РЅРёС†РёР°Р»РёР·Р°С†РёСЏ РјР°СЃСЃРёРІР° РїРѕРІРѕРґРѕРІ РєСѓРїРёС‚СЊ Р±СѓРєРµС‚ */
                            if (data["reasons"] !== undefined) {
                                angular.forEach(data["reasons"], function (reason) {
                                    var temp_reason = $factory({ classes: ["Reason", "Model", "States"], base_class: "Reason"});
                                    temp_reason._model_.fromJSON(reason);
                                    $misc.reasons.append(temp_reason);
                                });
                                $log.log("reasons = ", $misc.reasons.items);
                            }

                            /* Р�РЅРёС†РёР°Р»РёР·Р°С†РёСЏ РјР°СЃСЃРёРІР° РїРѕР»СѓС‡Р°С‚РµР»РµР№ Р±СѓРєРµС‚Р° */
                            if (data["addressees"] !== undefined) {
                                angular.forEach(data["addressees"], function (addressee) {
                                    var temp_addressee = $factory({ classes: ["Addressee", "Model", "States"], base_class: "Addressee"});
                                    temp_addressee._model_.fromJSON(addressee);
                                    $misc.addressees.append(temp_addressee);
                                });
                                $log.log("addressees = ", $misc.addressees.items);
                            }

                            /* Р�РЅРёС†РёР°Р»РёР·Р°С†РёСЏ РјР°СЃСЃРёРІР° СЃРїРѕСЃРѕР±РѕРІ РѕРїР»Р°С‚С‹ */
                            if (data["payment_methods"] !== undefined) {
                                angular.forEach(data["payment_methods"], function (payment_method) {
                                    var temp_payment_method = $factory({ classes: ["PaymentMethod", "Model"], base_class: "PaymentMethod"});
                                    temp_payment_method._model_.fromJSON(payment_method);
                                    $misc.paymentMethods.append(temp_payment_method);
                                });
                                $log.log("payment methods = ", $misc.addressees.items);
                            }

                            /* Р�РЅРёС†РёР°Р»РёР·Р°С†РёСЏ РјР°СЃСЃРёРІР° СЃРїРѕСЃРѕР±РѕРІ РґРѕСЃС‚Р°РІРєРё */
                            if (data["delivery_methods"] !== undefined) {
                                angular.forEach(data["delivery_methods"], function (delivery_method) {
                                    var temp_delivery_method = $factory({ classes: ["DeliveryMethod", "Model"], base_class: "DeliveryMethod"});
                                    temp_delivery_method._model_.fromJSON(delivery_method);
                                    $misc.deliveryMethods.append(temp_delivery_method);
                                });
                                $log.log("delivery methods = ", $misc.deliveryMethods.items);
                            }

                            /* Р�РЅРёС†РёР°Р»РёР·Р°С†РёСЏ РјР°СЃСЃРёРІР° РіРѕСЂРѕРґРѕРІ */
                            if (data["cities"] !== undefined) {
                                angular.forEach(data["cities"], function (city) {
                                    var temp_city = $factory({ classes: ["City", "Model"], base_class: "City"});
                                    temp_city._model_.fromJSON(city);
                                    $misc.cities.append(temp_city);
                                });
                                $log.log("cities = ", $misc.cities.items);
                            }

                        }
                    }
                );
            };

            return application;
        }]);
    })
    .run(function ($log, $rootScope, $admin, $flowers, $misc) {
        $rootScope.admin = $admin;
        $rootScope.flowers = $flowers;
        $rootScope.misc = $misc;
        $log.log("Welcome to gears");
        moment.locale("ru");

        //$flowers.init();
    });
