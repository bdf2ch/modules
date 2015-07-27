"use strict";


/**
 * РњРѕРґСѓР»СЊ application.flowers
 * РЎРѕРґРµСЂР¶РёС‚ С„СѓРЅРєС†РёРѕРЅР°Р» С†РІРµС‚РѕС‡РЅРѕРіРѕ РјР°РіР°Р·РёРЅР°
 */
var flowers = angular.module("application.flowers", [])
    .config(function ($provide) {


        /**
         * $flowers
         * РЎРµСЂРІРёСЃ ...
         */
        $provide.factory("$flowers", ["$log", "$http", "$factory", "$pagination", "$misc", function ($log, $http, $factory, $pagination, $misc) {
            var flowers = {};


            /**
             * РќР°Р±РѕСЂС‹ СЃРІРѕР№СЃС‚ Рё РјРµС‚РѕРґРѕРІ, РѕРїРёСЃС‹РІР°СЋС‰РёС… РјРѕРґРµР»Рё РґР°РЅРЅС‹С…
             */
            flowers.classes = {
                /**
                 * РќР°Р±РѕСЂ СЃРІРѕР№СЃС‚РІ, РѕРїРёСЃС‹РІР°СЋС‰РёС… С†РІРµС‚РѕРє
                 */
                Flower: {
                    id: new Field({ source: "id", value: 15, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: 0, backupable: true, required: true}),
                    description: new Field({ source: "description", value: "", backupable: true, required: true }),
                    price: new Field({ source: "price", value: 750, default_value: 0, backupable: true, required: true })
                },

                /**
                 * Addition
                 * Набор свойств, описывающих декоративное оформление букета
                 */
                Addition: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    description: new Field({ source: "description", value: "", default_value: "", backupable: true })
                },

                /**
                 * Bouquet
                 * Набор свойств и методов, описывающих букет
                 */
                Bouquet: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "",  backupable: true, required: true }),
                    descriptionShort: new Field({ source: "description_short", value: "", default_value: "", backupable: true, required: true }),
                    descriptionFull: new Field({ source: "description_full", value: "", default_value: "", backupable: true }),
                    price: new Field({ source: "price", value: 0, default_value: 0, backupable: true, required: true }),
                    imageUrl: new Field({ source: "image_url", value: "" }),
                    flowers: [],
                    additions: [],
                    reasons: $factory({ classes: ["Collection"], base_class: "Collection" }),
                    addressees: [],

                    /**
                     * Р”РѕР±Р°РІР»СЏРµС‚ С†РІРµС‚РѕРє Рє РјР°СЃСЃРёРІСѓ С†РІРµС‚РѕРІ, РІС…РѕРґСЏС‰РёС… РІ Р±СѓРєРµС‚
                     * @param flowerId - Р�РґРµРЅС‚РёС„РёРєР°С‚РѕСЂ С†РІРµС‚РєР°
                     */
                    addFlower: function (flowerId) {
                        if (flowerId !== undefined) {
                            var flower = flowers.flowers.find("id", flowerId);
                            if (flower !== false) {
                                this.flowers.push(flower);
                            }
                        }
                    },

                    /**
                     * Р”РѕР±Р°РІР»СЏРµС‚ РґРµРєРѕСЂР°С‚РёРІРЅРѕРµ РѕС„РѕСЂРјР»РµРЅРёРµ Рє РјР°СЃСЃРёРІСѓ РґРµРєРѕСЂР°С‚РёРІРЅС‹С… РѕС„РѕСЂРјР»РµРЅРёР№ Р±СѓРєРµС‚Р°
                     * @param additionId - Р�РґРµРЅС‚РёС„РёРєР°С‚РѕСЂ РґРµРєРѕСЂР°С‚РёРІРЅРѕРіРѕ РѕС„РѕСЂРјР»РµРЅРёСЏ
                     */
                    addAddition: function (additionId) {
                        if (additionId !== undefined) {
                            var addition = flowers.additions.find("id", additionId);
                            if (addition !== false) {
                                this.additions.push(addition);
                            }
                        }
                    },

                    addReason: function (reasonId, value) {
                        console.log("reasonId = ", reasonId);
                        console.log("value = ", value);
                        if (reasonId !== undefined && value !== undefined && value.constructor === Boolean) {
                            var temp_reason = this.reasons.find("id", reasonId);
                            if (temp_reason !== false)
                                temp_reason.enabled = value;
                            else {
                                var new_reason = $factory({ classes: ["Reason", "Model"], base_class: "Reason" });
                                new_reason._model_.fromAnother($misc.reasons.find("id", reasonId));
                                new_reason.enabled = value;
                                this.reasons.append(new_reason);
                            }
                        }
                    },

                    haveReason: function (reasonId) {
                        var result = false;
                        var length = this.reasons.items.length;
                        if (reasonId !== undefined) {
                            for (var i = 0; i < length; i++) {
                                if (this.reasons.items[i].id.value === reasonId) {
                                    result = true;
                                }
                            }
                        }
                        return result;
                    }
                },

                /**
                 * РќР°Р±РѕСЂ СЃРІРѕР№СЃС‚РІ, РѕРїРёСЃС‹РІР°СЋС‰РёС… РїРѕРґР°СЂРѕРє, РїСЂРёР»Р°РіР°РµРјС‹Р№ Рє Р±СѓРєРµС‚Сѓ
                 */
                Gift: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    description: new Field({ source: "description", value: "", default_value: "", backupable: true }),
                    price: new Field({ source: "price", value: 0, default_value: 0, backupable: true, required: true })
                }
            };


            /**
             * РџРµСЂРµРјРµРЅРЅС‹Рµ СЃРµСЂРІРёСЃР°
             */
            flowers.flowers = $factory({ classes: ["Collection"], base_class: "Collection" });
            flowers.bouquets = $factory({ classes: ["Collection"], base_class: "Collection" });
            flowers.additions = $factory({ classes: ["Collection"], base_class: "Collection" });
            flowers.gifts = $factory({ classes: ["Collection"], base_class: "Collection" });


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

                            /* Р�РЅРёС†РёР°Р»РёР·Р°С†РёСЏ РјР°СЃСЃРёРІР° РїРѕРІРѕРґРѕРІ РєСѓРїРёС‚СЊ Р±СѓРєРµС‚ */
                            if (data["reasons"] !== undefined) {
                                angular.forEach(data["reasons"], function (reason) {
                                    var temp_reason = $factory({ classes: ["Reason", "Model", "States"], base_class: "Reason"});
                                    temp_reason._model_.fromJSON(reason);
                                    $misc.reasons.append(temp_reason);
                                });
                                $log.log("reasons = ", $misc.reasons.items);
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

                                    if (bouquet["reasons"] !== undefined) {
                                        angular.forEach(bouquet["reasons"], function (reason) {
                                            var reason_id = parseInt(reason["reason_id"]);
                                            var value = parseInt(reason["value"]) === 1 ? true : false;
                                            temp_bouquet.addReason(reason_id, value);
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


            return flowers;
        }]);
    })
    .run(function ($modules, $flowers) {
        $modules.load($flowers);
        $flowers.init();
    }
);



flowers.controller("BouquetsController", ["$log", "$scope", "$flowers", "$pagination", "$misc", "$cart",
    function ($log, $scope, $flowers, $pagination, $misc, $cart) {
        $scope.flowers = $flowers;
        $scope.pagination = $pagination;
        $scope.misc = $misc;
        $scope.cart = $cart;

        $scope.selectReason = function (reasonId) {
            if (reasonId !== undefined) {
                angular.forEach($misc.reasons.items, function (reason) {
                    if (reason.id.value === reasonId) {
                        if (reason._states_.selected() === false) {
                            $misc.reasons.select("id", reasonId);
                        } else {
                            $misc.reasons.deselect(reason);
                        }
                    }
                });
            }
        };
}]);


flowers.controller("GearsBouquetsController", ["$log", "$scope", "$flowers", "$pagination", "$misc", "$location", "$routeParams",
    function ($log, $scope, $flowers, $pagination, $misc, $location, $routeParams) {
        $scope.flowers = $flowers;
        $scope.pagination = $pagination;
        $scope.misc = $misc;

        $scope.selectReason = function (reasonId) {
            if (reasonId !== undefined) {
                angular.forEach($misc.reasons.items, function (reason) {
                    if (reason.id.value === reasonId) {
                        if (reason._states_.selected() === false) {
                                $misc.reasons.select("id", reasonId);
                        } else {
                            $misc.reasons.deselect(reason);
                        }
                    }
                });
            }
        };

        $scope.gotoBouquet = function (bouquetId) {
            $location.url("/bouquets/" + bouquetId);
        };
    }]);


flowers.controller("GearsBouquetController", ["$log", "$scope", "$flowers", "$pagination", "$misc", "$location", "$routeParams", "$http",
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
                            if (data === "success") {
                                $scope.currentBouquet.reasons.find("id", reasonId).enabled = value;
                            } else {
                                $scope.currentBouquet.reasons.find("id", reasonId).enabled = !value;
                            }
                        }
                        $scope.misc.reasons._states_.loaded(true);
                    }
                );
            }
        };


        $scope.test = function (reasonId) {
            if ($scope.currentBouquet.haveReason(reasonId) === false) {
                $scope.currentBouquet.addReason(reasonId);
            } else {
                $scope.currentBouquet.reasons.delete("id", reasonId);
            }
            $log.log($scope.currentBouquet);
        };

    }]);

