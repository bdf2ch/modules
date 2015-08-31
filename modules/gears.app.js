"use strict";



var application = angular.module("gears.app", [
        "ngRoute",                      // Подключаем модуль управления рутами
        "gears",                        // Подключаем модуль с сервисами ядра системы
        "gears.ui",
        "gears.shop",                   // Подключаем модуль с сервисами онлайн-магазина
        "gears.auth",                   // Подключаем модуль с сервисами авторизации
        "gears.app.bouquets",           // Подключаем модуль с сервисами для управления данными о букетах
        "gears.app.misc",               // Подключаем модуль для управления прочимим данными
        "gears.app.orders",             // Подключаем модуль для управленя заказами пользователя
        "gears.app.controllers",        // Подключаем модуль с контроллерами приложения
        "gears.app.filters"             // Подключаем модуль с фильтрами приложения
    ])
    .config(function ($provide, $routeProvider) {


        $routeProvider
            .when("/", {
                templateUrl: "templates/bouquets/bouquets.html",
                controller: "BouquetsController"})
            .when("/bouquet/:bouquetId", {
                templateUrl: "templates/bouquet/bouquet.html",
                controller: "BouquetController"
            })
            .when("/cart", {
                templateUrl: "templates/cart/cart.html",
                controller: "CartController"
            })
            .when("/order", {
                templateUrl: "templates/order/order.html",
                controller: "OrderController"
            })
            .when("/confirm", {
                templateUrl: "templates/order/confirm.html",
                controller: "ConfirmationController"
            })
            .when("/account", {
                templateUrl: "templates/account/account.html",
                controller: "AccountController"
            })
            .when("/contacts", {
                templateUrl: "templates/contacts/contacts.html",
                controller: "ContactsController"
            })
            .otherwise({ redirectTo: '/' });


        /**
         * $application
         * Сервис приложения
         */
        $provide.factory("$application", ["$log", "$factory", "$orders", "$session", function ($log, $factory, $orders, $session) {
            var application = {};

            application.title = "Флористический салон Белый Лотос";
            application.description = "This is a test application provided by Shell Framework";
            application.currentPriceRangeId = 1;
            application.currentReasonId = 0;
            application.currentAddresseeId = 0;
            application.inAuthorizationMode = false;
            application.isLoading = false;

            application.onSuccessLogin = function (data) {
                if (data !== undefined) {
                    if (data["data"] !== undefined) {
                        if (data["data"]["orders"] !== undefined) {
                            angular.forEach(data["data"]["orders"], function (order) {
                                var temp_order = $factory({ classes: ["Order", "Model", "Backup", "States"], base_class: "Order" });
                                temp_order._model_.fromJSON(order);
                                temp_order._backup_.setup();
                                $orders.items.append(temp_order);
                            });
                        }
                    }
                    application.inAuthorizationMode = false;
                }
            };

            return application;
        }]);
    })
    .run(function ($log, $application, $menu, $rootScope, $modules, $factory, $session, $location, $orders, $misc) {
        $modules.load($application);
        $menu.register();
        $rootScope.application = $application;
        $rootScope.misc = $misc;
        $rootScope.menu = $menu;

        $session.onSuccessUserLogOut = function () {
            $authorization.reset();
            $orders.items.clear();
            $location.url("/");
        };

        $session.onSuccessInitUser = function () {
            $orders.getByUserId($session.user.get().id.value);
        };
        $session.init();

        moment.locale("ru");

        /**
         * Инициализация динамически создаваемых объектов
         */
        $application.currentOrder = $factory({ classes: ["Order", "Model", "States"], base_class: "Order" });

        //$application.currentOrder.customerName.value = "Евлампий";
        //$application.currentOrder.customerFname.value = "Алибардович";
        //$application.currentOrder.customerSurname.value = "Косоглазовский";
        //$application.currentOrder.customerPhone.value = "+7 (921) 555-66-789";
        //$application.currentOrder.customerEmail.value = "fuckingemail@email.com";
        //$application.currentOrder.comment.value = "Комментарий к заказу комментарий к заказу комментарий к заказу комментарий к заказу комментарий к заказу";
        //$application.currentOrder.recieverSurname.value = "Константинопольский";
        //$application.currentOrder.recieverName.value = "Константин";
        //$application.currentOrder.recieverFname.value = "Константинович";
        //$application.currentOrder.recieverPhone.value = "+7 (921) 666-55-423";
        //$application.currentOrder.addressStreet.value = "Героев Рыбачьего";
        //$application.currentOrder.addressBuilding.value = "202";
        //$application.currentOrder.addressBuildingIndex.value = "";
        //$application.currentOrder.addressFlat.value = "112";

        //$rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl){
        //    $log.log("$locationChangeStart fires");
        //    $log.log("newUrl = ", newUrl);
        //    $log.log("location path = ", $location.path());
        //    //event.preventDefault();
        //    if ($location.path === "/order") {
        //        $log.log("order path");
        //        if ($session.user.loggedIn() === false) {
        //            event.preventDefault();
        //            $location.path("/");
        //        }
        //    }
        //});
    }
);