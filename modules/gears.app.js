"use strict";



var application = angular.module("gears.app", [
        "ngRoute",                      // Подключаем модуль управления рутами
        "gears",                        // Подключаем модуль с сервисами ядра системы
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
            .otherwise({ redirectTo: '/' });


        /**
         * $application
         * Сервис приложения
         */
        $provide.factory("$application", ["$log", "$factory", function ($log, $factory) {
            var application = {};

            application.title = "Флористический салон Белый Лотос";
            application.description = "This is a test application provided by Shell Framework";
            application.currentPriceRangeId = 1;
            application.currentReasonId = 0;
            application.currentAddresseeId = 0;
            //application.currentOrder = $factory({ classes: ["Order"], base_class: "Order" });

            return application;
        }]);
    })
    .run(function ($log, $application, $menu, $rootScope, $modules, $cart) {
        $modules.load($application);
        $menu.register();
        $rootScope.application = $application;
        $rootScope.menu = $menu;
    }
);