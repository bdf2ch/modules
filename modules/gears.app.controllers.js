"use strict";


var appControllers = angular.module("gears.app.controllers", []);

appControllers.controller("BouquetsController", ["$log", "$scope", "$application", "$flowers", "$pagination", "$misc", "$cart",
    function ($log, $scope, $application, $flowers, $pagination, $misc, $cart) {
        $scope.flowers = $flowers;
        $scope.pagination = $pagination;
        $scope.misc = $misc;
        $scope.cart = $cart;
        $scope.app = $application;
        $scope.slides = [
            {
                image: "resources/img/promo.jpg",
                url: "#/order"
            },
            {
                image: "resources/img/promo2.jpg",
                url: "#/confirm"
            }
        ];


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
                $pagination.set(1);
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
                $pagination.set(1);
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
                $pagination.set(1);
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

        $scope.selectCategory = function (categoryId) {
            if (categoryId !== undefined) {
                angular.forEach($misc.categories.items, function (category) {
                    if (category.id.value === categoryId) {
                        if (category._states_.selected() === false) {
                            $misc.categories.select("id", categoryId);
                        } else {
                            $misc.categories.deselect(category);
                        }
                    }
                });
                $pagination.set(1);
            }
        };


        $scope.applyFilters = function () {

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


appControllers.controller("BouquetController", ["$log", "$scope", "$routeParams", "$flowers", "$misc", "$factory", function ($log, $scope, $routeParams, $flowers, $misc, $factory) {
    $scope.flowers = $flowers;
    $scope.misc = $misc;
    $scope.bouquet = undefined;
    $scope.bouquetPriceRangeId = 0;
    $scope.bouquetFlowers = [];

    $log.log($routeParams);

    $scope.$watch("flowers.bouquets._states_.loaded()", function (flag) {
        $log.log("bouquets is loaded = ", flag);
        if (flag === true) {
            $scope.bouquet = $flowers.bouquets.find("id", parseInt($routeParams.bouquetId));
            angular.forEach($misc.prices.items, function (price) {
                if ($scope.bouquet.price.value >= price.start && $scope.bouquet.price.value <= price.end)
                    $scope.bouquetPriceRangeId = price.id;
            });
        }
    });

    if ($routeParams.bouquetId !== undefined) {
        if ($flowers.bouquets.size() === 0) {
            $flowers.init();
        } else {
            $scope.bouquet = $flowers.bouquets.find("id", parseInt($routeParams.bouquetId));
            angular.forEach($misc.prices.items, function (price) {
                if ($scope.bouquet.price.value >= price.start && $scope.bouquet.price.value <= price.end)
                    $scope.bouquetPriceRangeId = price.id;
            });
            angular.forEach($scope.bouquet.flowers.items, function (flower) {
                var temp_flower = $misc.flowers.find("id", flower.flowerId.value);
                $scope.bouquetFlowers.push(temp_flower);
            });
        }
    }

    $log.log("currentBouquet = ", $scope.bouquet);
}]);



appControllers.controller("OrderController", ["$log", "$scope", "$location", "$cart", "$factory", "$misc", "$orders", "$application", "$session", "$window", function ($log, $scope, $location, $cart, $factory, $misc, $orders, $application, $session, $window) {
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

    $window.scrollTo(0, 1);
    //window.scrollTo(0, 0);

    if ($session.user.loggedIn() === true) {
        var user = $session.user.get();
        $scope.order.customerName.value = user.name.value;
        $scope.order.customerFname.value = user.fname.value;
        $scope.order.customerSurname.value = user.surname.value;
        $scope.order.customerEmail.value = user.email.value;
        $scope.order.customerPhone.value = user.phone.value;
    }


    /* РџРµСЂРµС…РѕРґ РЅР° РіР»Р°РІРЅСѓСЋ СЃС‚СЂР°РЅРёС†Сѓ */
    $scope.gotoMain = function () {
        $location.url("/");
    };

    /*** Р’Р°Р»РёРґР°С†РёСЏ С„РѕСЂРјС‹ Р·Р°РєР°Р·Р° ***/
    $scope.validate = function () {
        $scope.errorCounter = 0;
        /* Р�РјСЏ Р·Р°РєР°Р·С‡РёРєР° */
        if ($scope.order.customerName.value === "") {
            $scope.errors.customer.name = "Вы не указали Ваше имя";
            $scope.errorCounter++;
        } else
            $scope.errors.customer.name = false;

        /* РћС‚С‡РµСЃС‚РІРѕ Р·Р°РєР°Р·С‡РёРєР° */
        //if ($scope.order.customerFname.value === "") {
        //    $scope.errors.customer.fname = "Вы не указали Ваше отчество";
        //    $scope.errorCounter++;
        //} else
        //    $scope.errors.customer.fname = false;

        /* Р¤Р°РјРёР»РёСЏ Р·Р°РєР°Р·С‡РёРєР° */
        if ($scope.order.customerSurname.value === "") {
            $scope.errors.customer.surname = "Вы не указали Вашу фамилию";
            $scope.errorCounter++;
        } else
            $scope.errors.customer.surname = false;

        /* РљРѕРЅС‚Р°РєС‚РЅС‹Р№ С‚РµР»РµС„РѕРЅ Р·Р°РєР°Р·С‡РёРєР° */
        if ($scope.order.customerPhone.value === "") {
            $scope.errors.customer.phone = "Вы не указали Ваш контактный телефон";
            $scope.errorCounter++;
        } else
            $scope.errors.customer.phone = false;

        /* Р­Р»РµРєС‚СЂРѕРЅРЅР°СЏ РїРѕС‡С‚Р° Р·Р°РєР°Р·С‡РёРєР° */
        if ($scope.order.customerEmail.value === "") {
            $scope.errors.customer.email = "Вы не указали Ваш e-mail";
            $scope.errorCounter++;
        } else
            $scope.errors.customer.email = false;

        /* Р•СЃР»Рё Р·Р°РєР°Р·С‡РёРє Рё РїРѕР»СѓС‡Р°С‚РµР»СЊ - СЌС‚Рѕ РѕРґРЅРѕ Р»РёС†Рѕ */
        if ($scope.order.customerIsReciever.value === false) {

            /* Р�РјСЏ РїРѕР»СѓС‡Р°С‚РµР»СЏ */
            if ($scope.order.recieverName.value === "") {
                $scope.errors.reciever.name = "Вы не указали имя получателя";
                $scope.errorCounter++;
            } else
                $scope.errors.reciever.name = false;

            /* РћС‚С‡РµС‚С‡РІРѕ Р·Р°РєР°Р·С‡РёРєР° */
            //if ($scope.order.recieverFname.value === "") {
            //    $scope.errors.reciever.fname = "Вы не указали отчество получателя";
            //    $scope.errorCounter++;
            //} else
            //    $scope.errors.reciever.fname = false;

            /* Р¤Р°РјРёР»РёСЏ Р·Р°РєР°Р·С‡РёРєР° */
            if ($scope.order.recieverSurname.value === "") {
                $scope.errors.reciever.surname = "Вы не указали фамилию получателя";
                $scope.errorCounter++;
            } else
                $scope.errors.reciever.surname = false;

            /* РљРѕРЅС‚Р°РєС‚РЅС‹Р№ С‚РµР»РµС„РѕРЅ Р·Р°РєР°Р·С‡РёРєР° */
            if ($scope.order.recieverPhone.value === "") {
                $scope.errors.reciever.phone = "Вы не указали контактный телефон получателя";
                $scope.errorCounter++;
            } else
                $scope.errors.reciever.phone = false;
        }

        /* Р•СЃР»Рё РІС‹Р±СЂР°РЅР° РґРѕСЃС‚Р°РІРєР° РєСѓСЂСЊРµСЂРѕРј */
        if ($scope.order.deliveryMethodId.value === 2) {
            /* РђРґСЂРµСЃ РґРѕСЃС‚Р°РІРєРё - СѓР»РёС†Р° */
            if ($scope.order.addressStreet.value === "") {
                $scope.errors.address.street = "Вы не указали улицу";
                $scope.errorCounter++;
            } else
                $scope.errors.address.street = false;

            /* РђРґСЂРµСЃ РґРѕСЃС‚Р°РІРєРё - РґРѕРј */
            if ($scope.order.addressBuilding.value === "") {
                $scope.errors.address.building = "Вы не указали дом°";
                $scope.errorCounter++;
            } else
                $scope.errors.address.building = false;

            /* РђРґСЂРµСЃ РґРѕСЃС‚Р°РІРєРё - РєРІР°СЂС‚РёСЂР° */
            if ($scope.order.addressFlat.value === "") {
                $scope.errors.address.flat = "Вы не указали квартиру";
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
                $session.user.set(temp_user);
                $scope.accountIsCreated = true;
            }
            $application.currentOrder._states_.loaded(true);
            $application.currentOrder._model_.reset();
            $cart.clear();
        }
    };

    $log.log($scope.orders.order);

}]);



appControllers.controller("AccountController", ["$log", "$scope", "$http", "$orders", "$session", "$factory", "$location", "$authorization", function ($log, $scope, $http, $orders, $session, $factory, $location, $authorization) {
    $scope.session = $session;
    $scope.orders = $orders;
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



    $session.onSuccessUserLogOut = function () {
        $authorization.reset();
        $orders.items.clear();
        $location.url("/");
    };
}]);



appControllers.controller("ContactsController", ["$log", "$scope", function ($log, $scope) {

}]);