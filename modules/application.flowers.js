//"use strict";


/**
 * Модуль application.flowers
 * Содержит функционал цветочного магазина
 */
var flowers = angular.module("application.flowers", [])
    .config(function ($provide) {


        /**
         * $flowers
         * Сервис ...
         */
        $provide.factory("$flowers", ["$log", "$http", "$factory", "$pagination", "$misc", function ($log, $http, $factory, $pagination, $misc) {
            var flowers = {};


            /**
             * Наборы свойст и методов, описывающих модели данных
             */
            flowers.classes = {
                /**
                 * Набор свойств, описывающих цветок
                 */
                Flower: {
                    id: new Field({ source: "id", value: 15, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: 0, backupable: true, required: true}),
                    description: new Field({ source: "description", value: "", backupable: true, required: true }),
                    price: new Field({ source: "price", value: 750, default_value: 0, backupable: true, required: true })
                },

                /**
                 * Набор свойств, описывающих материал оформления букета
                 */
                Addition: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    description: new Field({ source: "description", value: "", default_value: "", backupable: true })
                },

                /**
                 * Набор свойств, описывающих букет
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

                    /**
                     * Добавляет цветок к массиву цветов, входящих в букет
                     * @param flowerId - Идентификатор цветка
                     */
                    addFlower: function (flowerId) {
                        if (flowerId !== undefined) {
                            var flower = flowers.flowers.find("id", flowerId);
                            if (flower !== false) {
                                this.flowers.append(flower);
                            }
                        }
                    },

                    /**
                     * Добавляет декоративное оформление к массиву декоративных оформлений букета
                     * @param additionId - Идентификатор декоративного оформления
                     */
                    addAddition: function (additionId) {
                        if (additionId !== undefined) {
                            var addition = flowers.additions.find("id", additionId);
                            if (addition !== false) {
                                this.additions.push(addition);
                            }
                        }
                    }
                },

                /**
                 * Набор свойств, описывающих подарок, прилагаемый к букету
                 */
                Gift: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    description: new Field({ source: "description", value: "", default_value: "", backupable: true }),
                    price: new Field({ source: "price", value: 0, default_value: 0, backupable: true, required: true })
                }
            };


            /**
             * Переменные сервиса
             */
            flowers.flowers = $factory({ classes: ["Collection"], base_class: "Collection" });
            flowers.bouquets = $factory({ classes: ["Collection"], base_class: "Collection" });
            flowers.additions = $factory({ classes: ["Collection"], base_class: "Collection" });
            flowers.gifts = $factory({ classes: ["Collection"], base_class: "Collection" });


            flowers.init = function () {
                $http.post("serverside/controllers/init.php", {})
                    .success(function (data) {
                        if (data !== undefined) {

                            /* Инициализация массива цветов */
                            if (data["flowers"] !== undefined) {
                                angular.forEach(data["flowers"], function (flower) {
                                    temp_flower = $factory({ classes: ["Flower", "Model"], base_class: "Flower"});
                                    temp_flower._model_.fromJSON(flower);
                                    flowers.flowers.append(temp_flower);
                                });
                                $log.log("flowers = ", $misc.flowers.items);
                            }

                            /* Инициализация массива декоративных оформлений */
                            if (data["additions"] !== undefined) {
                                angular.forEach(data["additions"], function (addition) {
                                    temp_addition = $factory({ classes: ["Addition", "Model"], base_class: "Addition"});
                                    temp_addition._model_.fromJSON(addition);
                                    flowers.additions.append(temp_addition);
                                });
                                $log.log("additions = ", $misc.additions.items);
                            }

                            /* Инициализация массива букетов */
                            if (data["bouquets"] !== undefined) {
                                angular.forEach(data["bouquets"], function (bouquet) {
                                    temp_bouquet = $factory({ classes: ["Bouquet", "Model", "Backup"], base_class: "Bouquet"});
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

                            /* Инициализация массива поводов купить букет */
                            if (data["reasons"] !== undefined) {
                                angular.forEach(data["reasons"], function (reason) {
                                    temp_reason = $factory({ classes: ["Reason", "Model"], base_class: "Reason"});
                                    temp_reason._model_.fromJSON(reason);
                                    $misc.reasons.append(temp_reason);
                                });
                                $log.log("reasons = ", $misc.reasons.items);
                            }

                            /* Инициализация массива получателей букета */
                            if (data["addressees"] !== undefined) {
                                angular.forEach(data["addressees"], function (addressee) {
                                    temp_addressee = $factory({ classes: ["Addressee", "Model"], base_class: "Addressee"});
                                    temp_addressee._model_.fromJSON(addressee);
                                    $misc.addressees.append(temp_addressee);
                                });
                                $log.log("addressees = ", $misc.addressees.items);
                            }

                            /* Инициализация массива способов оплаты */
                            if (data["payment_methods"] !== undefined) {
                                angular.forEach(data["payment_methods"], function (payment_method) {
                                    temp_payment_method = $factory({ classes: ["PaymentMethod", "Model"], base_class: "PaymentMethod"});
                                    temp_payment_method._model_.fromJSON(payment_method);
                                    $misc.paymentMethods.append(temp_payment_method);
                                });
                                $log.log("payment methods = ", $misc.addressees.items);
                            }

                            /* Инициализация массива способов доставки */
                            if (data["delivery_methods"] !== undefined) {
                                angular.forEach(data["delivery_methods"], function (delivery_method) {
                                    temp_delivery_method = $factory({ classes: ["DeliveryMethod", "Model"], base_class: "DeliveryMethod"});
                                    temp_delivery_method._model_.fromJSON(delivery_method);
                                    $misc.deliveryMethods.append(temp_delivery_method);
                                });
                                $log.log("delivery methods = ", $misc.deliveryMethods.items);
                            }

                            /* Инициализация массива городов */
                            if (data["cities"] !== undefined) {
                                angular.forEach(data["cities"], function (city) {
                                    temp_city = $factory({ classes: ["City", "Model"], base_class: "City"});
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
}]);