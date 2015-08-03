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
         * пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ
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
         * пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅ
         * @param priceRangeId {number} - пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅ
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


        $scope.selectFlower = function (flowerId) {
            if (flowerId !== undefined) {
                angular.forEach($misc.flowers.items, function (flower) {
                    if (flower.id.value === flowerId) {
                        if (flower._states_.selected() === false) {
                            $misc.flowers.select("id", flowerId);
                        } else {
                            $misc.flowers.deselect(flower);
                        }
                    }
                });
            }
        };
    }]
);


appControllers.controller("BouquetController", ["$log", "$scope", "$cart", function ($log, $scope, $cart) {
    $scope.cart = $cart;
}]);


appControllers.controller("CartController", ["$log", "$scope", "$location", "$cart", "$flowers", function ($log, $scope, $location, $cart, $flowers) {
    $scope.flowers = $flowers;
    $log.log($cart.items);

    $scope.gotoOrder = function () {
        $location.url("/order");
    };
}]);


appControllers.controller("OrderController", ["$log", "$scope", function ($log, $scope) {

}]);


appControllers.controller("BouquetController", ["$log", "$scope", "$routeParams", "$flowers", "$misc", function ($log, $scope, $routeParams, $flowers, $misc) {
    $scope.flowers = $flowers;
    $scope.misc = $misc;
    $scope.bouquet = undefined;
    $scope.bouquetPriceRangeId = 0;

    $log.log($routeParams);

    if ($routeParams.bouquetId !== undefined) {
        $scope.bouquet = $flowers.bouquets.find("id", parseInt($routeParams.bouquetId));
        angular.forEach($misc.prices.items, function (price) {
            if ($scope.bouquet.price.value >= price.start && $scope.bouquet.price.value <= price.end)
                $scope.bouquetPriceRangeId = price.id;
        });
    }

    $log.log("currentBouquet = ", $scope.bouquet);
}]);



appControllers.controller("OrderController", ["$log", "$scope", "$location", "$cart", "$factory", "$misc", "$orders", "$application", function ($log, $scope, $location, $cart, $factory, $misc, $orders, $application) {
    $scope.cart = $cart;
    $scope.misc = $misc;
    $scope.orders = $orders;
    $scope.app = $application;
    $scope.order = $application.currentOrder;
    $scope.errors = {
        customer: {
            name: false,
            fname: false,
            surname: false,
            phone: false,
            email: false
        },
        reciever: {
            name: false,
            fname: false,
            surname: false,
            phone: false
        },
        address: {
            street: false,
            building: false,
            flat: false
        },
        delivery: {
            date: false
        }
    };
    $scope.errorCounter = 0;



    /* РџРµСЂРµС…РѕРґ РЅР° РіР»Р°РІРЅСѓСЋ СЃС‚СЂР°РЅРёС†Сѓ */
    $scope.gotoMain = function () {
        $location.url("/");
    };

    /*** Р’Р°Р»РёРґР°С†РёСЏ С„РѕСЂРјС‹ Р·Р°РєР°Р·Р° ***/
    $scope.validate = function () {
        $scope.errorCounter = 0;
        /* Р�РјСЏ Р·Р°РєР°Р·С‡РёРєР° */
        if ($scope.order.customerName.value === "") {
            $scope.errors.customer.name = "Р’С‹ РЅРµ СѓРєР°Р·Р°Р»Рё Р’Р°С€Рµ РёРјСЏ";
            $scope.errorCounter++;
        } else
            $scope.errors.customer.name = false;

        /* РћС‚С‡РµСЃС‚РІРѕ Р·Р°РєР°Р·С‡РёРєР° */
        if ($scope.order.customerFname.value === "") {
            $scope.errors.customer.fname = "Р’С‹ РЅРµ СѓРєР°Р·Р°Р»Рё Р’Р°С€Рµ РѕС‚С‡РµСЃС‚РІРѕ";
            $scope.errorCounter++;
        } else
            $scope.errors.customer.fname = false;

        /* Р¤Р°РјРёР»РёСЏ Р·Р°РєР°Р·С‡РёРєР° */
        if ($scope.order.customerSurname.value === "") {
            $scope.errors.customer.surname = "Р’С‹ РЅРµ СѓРєР°Р·Р°Р»Рё Р’Р°С€Сѓ С„Р°РјРёР»РёСЋ";
            $scope.errorCounter++;
        } else
            $scope.errors.customer.surname = false;

        /* РљРѕРЅС‚Р°РєС‚РЅС‹Р№ С‚РµР»РµС„РѕРЅ Р·Р°РєР°Р·С‡РёРєР° */
        if ($scope.order.customerPhone.value === "") {
            $scope.errors.customer.phone = "Р’С‹ РЅРµ СѓРєР°Р·Р°Р»Рё Р’Р°С€ РєРѕРЅС‚Р°РєС‚РЅС‹Р№ С‚РµР»РµС„РѕРЅ";
            $scope.errorCounter++;
        } else
            $scope.errors.customer.phone = false;

        /* Р­Р»РµРєС‚СЂРѕРЅРЅР°СЏ РїРѕС‡С‚Р° Р·Р°РєР°Р·С‡РёРєР° */
        if ($scope.order.customerEmail.value === "") {
            $scope.errors.customer.email = "Р’С‹ РЅРµ СѓРєР°Р·Р°Р»Рё Р’Р°С€ e-mail";
            $scope.errorCounter++;
        } else
            $scope.errors.customer.email = false;

        /* Р•СЃР»Рё Р·Р°РєР°Р·С‡РёРє Рё РїРѕР»СѓС‡Р°С‚РµР»СЊ - СЌС‚Рѕ РѕРґРЅРѕ Р»РёС†Рѕ */
        if ($scope.order.customerIsReciever.value === false) {

            /* Р�РјСЏ РїРѕР»СѓС‡Р°С‚РµР»СЏ */
            if ($scope.order.recieverName.value === "") {
                $scope.errors.reciever.name = "Р’С‹ РЅРµ СѓРєР°Р·Р°Р»Рё РёРјСЏ РїРѕР»СѓС‡Р°С‚РµР»СЏ";
                $scope.errorCounter++;
            } else
                $scope.errors.reciever.name = false;

            /* РћС‚С‡РµС‚С‡РІРѕ Р·Р°РєР°Р·С‡РёРєР° */
            if ($scope.order.recieverFname.value === "") {
                $scope.errors.reciever.fname = "Р’С‹ РЅРµ СѓРєР°Р·Р°Р»Рё РѕС‚С‡РµСЃС‚РІРѕ РїРѕР»СѓС‡Р°С‚РµР»СЏ";
                $scope.errorCounter++;
            } else
                $scope.errors.reciever.fname = false;

            /* Р¤Р°РјРёР»РёСЏ Р·Р°РєР°Р·С‡РёРєР° */
            if ($scope.order.recieverSurname.value === "") {
                $scope.errors.reciever.surname = "Р’С‹ РЅРµ СѓРєР°Р·Р°Р»Рё С„Р°РјРёР»РёСЋ РїРѕР»СѓС‡Р°С‚РµР»СЏ";
                $scope.errorCounter++;
            } else
                $scope.errors.reciever.surname = false;

            /* РљРѕРЅС‚Р°РєС‚РЅС‹Р№ С‚РµР»РµС„РѕРЅ Р·Р°РєР°Р·С‡РёРєР° */
            if ($scope.order.recieverPhone.value === "") {
                $scope.errors.reciever.phone = "Р’С‹ РЅРµ СѓРєР°Р·Р°Р»Рё РєРѕРЅС‚Р°РєС‚РЅС‹Р№ С‚РµР»РµС„РѕРЅ РїРѕР»СѓС‡Р°С‚РµР»СЏ";
                $scope.errorCounter++;
            } else
                $scope.errors.reciever.phone = false;
        }

        /* Р•СЃР»Рё РІС‹Р±СЂР°РЅР° РґРѕСЃС‚Р°РІРєР° РєСѓСЂСЊРµСЂРѕРј */
        if ($scope.order.deliveryMethodId.value === 2) {
            /* РђРґСЂРµСЃ РґРѕСЃС‚Р°РІРєРё - СѓР»РёС†Р° */
            if ($scope.order.addressStreet.value === "") {
                $scope.errors.address.street = "Р’С‹ РЅРµ СѓРєР°Р·Р°Р»Рё СѓР»РёС†Сѓ";
                $scope.errorCounter++;
            } else
                $scope.errors.address.street = false;

            /* РђРґСЂРµСЃ РґРѕСЃС‚Р°РІРєРё - РґРѕРј */
            if ($scope.order.addressBuilding.value === "") {
                $scope.errors.address.building = "Р’С‹ РЅРµ СѓРєР°Р·Р°Р»Рё РЅРѕРјРµСЂ РґРѕРјР°";
                $scope.errorCounter++;
            } else
                $scope.errors.address.building = false;

            /* РђРґСЂРµСЃ РґРѕСЃС‚Р°РІРєРё - РєРІР°СЂС‚РёСЂР° */
            if ($scope.order.addressFlat.value === "") {
                $scope.errors.address.flat = "Р’С‹ РЅРµ СѓРєР°Р·Р°Р»Рё РЅРѕРјРµСЂ РєРІР°СЂС‚РёСЂС‹";
                $scope.errorCounter++;
            } else
                $scope.errors.address.flat = false;

            /* Р”Р°С‚Р° Рё РІСЂРµРјСЏ РґРѕСЃС‚Р°РІРєРё */
            //if ($scope.deliveryDate === "") {
            //    $scope.errors.delivery.date = "Р’С‹ РЅРµ СѓРєР°Р·Р°Р»Рё РґР°С‚Сѓ РґРѕСЃС‚Р°РІРєРё";
            //    $scope.errorCounter++;
            //} else
            //    $scope.errors.delivery.date = false;
        }

        if ($scope.errorCounter === 0) {
            //$scope.order.deliveryStart.value = parseInt(moment($scope.deliveryDate + " ," + $scope.deliveryHours + ":" + $scope.deliveryMinutes, "DD.MM.YYYY, HH:mm").unix());
            $location.url("/confirm");
        }
    };

}]);



appControllers.controller("ConfirmationController", ["$log", "$scope", "$orders", "$cart", "$misc", "$location", "$session", "$factory", "$application", "$flowers", function ($log, $scope, $orders, $cart, $misc, $location, $session, $factory, $application, $flowers) {
    $scope.cart = $cart;
    $scope.orders = $orders;
    $scope.misc = $misc;
    $scope.flowers = $flowers;

    $scope.orderIsConfirmed = false;
    $scope.accountIsCreated = false;

    /* РџРµСЂРµС…РѕРґ Рє СЃС‚СЂР°РЅРёС†Рµ РѕС„РѕСЂРјР»РµРЅРёСЏ Р·Р°РєР°Р·Р° */
    $scope.gotoOrder = function () {
        $location.url("/order");
    };

    $scope.onSuccessAddOrder = function (data) {
        if (data !== undefined) {
            if (data["order"] !== undefined) {
                var temp_order = $factory({ classes: ["Order", "Model", "Backup", "States"], base_class: "Order" });
                temp_order._model_.fromJSON(data["order"]);
                temp_order._backup_.setup();
                $scope.orders.items.append(temp_order);
                $scope.orderIsConfirmed = true;
            }
            if (data["user"] !== undefined) {
                var temp_user = $factory({ classes: ["CurrentUser", "Model", "Backup", "States"], base_class: "CurrentUser" });
                temp_user._model_.fromJSON(data["user"]);
                temp_user._backup_.setup();
                $session.setUser(temp_user);
                $scope.accountIsCreated = true;
            }
            $application.currentOrder._states_.loaded(true);
        }
    };

    $log.log($scope.orders.order);

}]);



appControllers.controller("AccountController", ["$log", "$scope", function ($log, $scope) {
    $scope.tabs = [
        {
            id: 1,
            title: "О Вас",
            template: "templates/account/account_about.html",
            selected: true
        },
        {
            id: 2,
            title: "Ваши заказы",
            template: "templates/account/account_orders.html",
            selected: false
        }
    ];
    $scope.activeTab = $scope.tabs[0];

    $scope.selectTab = function (tabId) {
        if (tabId !== undefined) {
            angular.forEach($scope.tabs, function (tab) {
                if (tab.id === tabId) {
                    tab.selected = true;
                    $scope.activeTab = tab;
                } else
                    tab.selected = false;
            });
        }
    };
}]);