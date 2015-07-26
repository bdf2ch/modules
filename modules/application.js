"use strict";



var application = angular.module("application", [
        "ngRoute",          // Подключаем модуль управления рутами
        "core",             // Подключаем модуль с сервисами ядра системы
        "core.filters",     // Подключаем модуль с фильтрами
        "application.flowers",
        "application.misc",
        "application.shop"
        //"application.titules"
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
        $provide.factory("$application", [function () {
            var application = {};

            application.title = "Флористический салон Белый Лотос";
            application.description = "This is a test application provided by Shell Framework";

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