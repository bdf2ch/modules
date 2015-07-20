"use strict";


var shop = angular.module("application.shop", [])
    .config(function ($provide) {

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
