"use strict";


var shop = angular.module("application.shop", [])
    .config(function ($provide) {

        /********************
         * $cart
         * Сервис, определяющий функционал корзины покупок пользователя
         ********************/
        $provide.factory("$cart", ["$log", "$factory", function ($log, $factory) {
            var cart = {};


            /**
             * Наборы свойст и методов, описывающих модели данных
             */
            cart.classes = {
                /**
                 * Набор классов и методов, описывающих элемент корзины покупок
                 */
                CartItem: {
                    productId: 0,
                    price: 0,
                    amount: 1,

                    init: function (parameters) {
                        if (parameters !== undefined) {
                            for (var param in parameters) {
                                if (this.hasOwnProperty(param) !== param !== "amount")
                                    this[param] = parameters[param];
                            }
                        }
                    }
                }
            };


            /**
             * Переменные сервиса
             */
            cart.items = $factory({ classes: ["Collection"], base_class: "Collection" });
            var totalPrice = 0;


            /**
             * Добавляет элемент в корзину покупок
             * @param item {Any} - Объект, описывающий покупку
             * @returns {number} - Возвращает количество элементов в корзине покупок
             */
            cart.add = function (item) {
                $log.log(item);
                $log.log("totalprice = ", totalPrice);
                var temp_cart_item = $factory({ classes: ["CartItem"], base_class: "CartItem" });
                temp_cart_item.init({ productId: item.id.value, price: item.price.value });
                cart.items.append(temp_cart_item);
                totalPrice += temp_cart_item.price;
                return cart.items.size();
            };


            /**
             * Удаляет элемент из корзины
             * @param productId - Идентификатор элемента корзины покупок
             * @returns {number} - Возвращает количество элементов в корзине покупок, в противном случае - false
             */
            cart.delete = function (productId) {
                var result = false;
                if (productId !== undefined) {
                    var product = cart.items.find("productId", productId);
                    if (product !== false) {
                        cart.items.delete("productId", productId);
                        totalPrice -= product.price;
                        result = cart.size();
                    }
                } else
                    $log.error("$cart: Не указан идентификатор элемента корзины покупок");
                return result;
            };


            /**
             * Возвращает общее количество элементов в корзине покупок
             * @returns {number} - Возвращает количество элементов в корзине покупок
             */
            cart.amount = function () {
                return cart.items.size();
            };


            /**
             * Возвращает общую стоимость элемнтов в корзине покупок
             * @returns {number} - Возвращает общую стоимость элементов в корзине покупок
             */
            cart.price = function () {
                return totalPrice;
            };

            return cart;
        }]);





        /********************
         * $order
         * Сервис, определюящий функционал заказа пользователя
         ********************/
        $provide.factory("$order", [function () {
            var order = {};

            return order;
        }]);

    })
    .run(function ($rootScope, $modules, $cart) {
        $modules.load($cart);
        $rootScope.cart = $cart;
    });
