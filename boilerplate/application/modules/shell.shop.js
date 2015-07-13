"use strict";


var shop = angular.module("shell.shop", [])
    .config(function ($provide) {

        /**
         * $shopClasses
         * Сервис, содержащий описание классов модуля
         */
        $provide.factory("$shopClasses", [function () {
            var shopClasses = {};

            shopClasses.classes = {};

            return shopClasses;
        }]);

        /**
         * $cart
         * Сервис, определяющий функционал корзины покупок пользователя
         */
        $provide.factory("$cart", [function () {
            var cart = {};

            return cart;
        }]);

        /**
         * $order
         * Сервис, определюящий функционал заказа пользователя
         */
        $provide.factory("$order", [function () {
            var order = {};

            return order;
        }]);
    })
    .run(function () {

    });
