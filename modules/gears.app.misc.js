"use strict";



var nisc = angular.module("gears.app.misc", [])
    .config(function ($provide) {
        $provide.factory("$misc", ["$log", "$factory", function ($log, $factory) {
            var misc = {};


            /**
             * Наборы свойст и методов, описывающих модели данных
             */
            misc.classes = {
                /**
                 * Flower
                 * Набор свойств, описывающих цветок
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
                 * Reason
                 * Набор свойств, описывающих повод для покупки букета
                 */
                Reason: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    imageUrl: new Field({ source: "image_url", value: "", default_value: "", backupable: true, required: true }),
                    enabled: false
                },

                /**
                 * Addressee
                 * Набор свойств, описывающих аполучателя букета
                 */
                Addressee: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    imageUrl: new Field({ source: "image_url", value: "", default_value: "", backupable: true, required: true }),
                    enabled: false
                },

                /**
                 * PaymentMethod
                 * Набор свойств, описывающих способ оплаты
                 */
                PaymentMethod: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true })
                },

                /**
                 * DeliveryMethod
                 * Набор свойст, описывающих способ доставки
                 */
                DeliveryMethod: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    price: new Field({ source: "price", value: 0, default_value: 0, backupable: true, required: true })
                },

                /**
                 * City
                 * Набор свойств, описывающих город
                 */
                City: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true })
                },

                /**
                 * PriceRange
                 * Набор свойств, описывающих диапозон цен
                 */
                PriceRange: {
                    id: 0,
                    start: 0,
                    end: 0,
                    title: "",

                    init: function (parameters) {
                        if (parameters !== undefined) {
                            for (var param in parameters) {
                                if (this.hasOwnProperty(param))
                                    this[param] = parameters[param];
                            }
                            if (!parameters.hasOwnProperty("title"))
                                this.title = "от " + this.start + " р. до " + this.end + " р.";
                        }
                    }
                }
            };


            /**
             * Переменные сервиса
             */
            misc.flowers = $factory({ classes: ["Collection"], base_class: "Collection" });
            misc.additions = $factory({ classes: ["Collection"], base_class: "Collection" });
            misc.reasons = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            misc.addressees = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            misc.paymentMethods = $factory({ classes: ["Collection"], base_class: "Collection" });
            misc.deliveryMethods = $factory({ classes: ["Collection"], base_class: "Collection" });
            misc.cities = $factory({ classes: ["Collection"], base_class: "Collection" });
            misc.prices = $factory({ classes: ["Collection"], base_class: "Collection" });

            return misc;
        }]) ;
    })
    .run(function ($log, $modules, $misc, $factory) {
        $modules.load($misc);
        $misc.prices.append($factory({ classes: ["PriceRange", "States"], base_class: "PriceRange" }));
        $misc.prices.items[0].init({ id: 1, start: 0, end: 10000, title: "Любая цена" });
        $misc.prices.append($factory({ classes: ["PriceRange", "States"], base_class: "PriceRange" }));
        $misc.prices.items[1].init({ id: 2, start: 1000, end: 2000 });
        $misc.prices.append($factory({ classes: ["PriceRange", "States"], base_class: "PriceRange" }));
        $misc.prices.items[2].init({ id: 3, start: 2000, end: 3000 });
        $misc.prices.append($factory({ classes: ["PriceRange", "States"], base_class: "PriceRange" }));
        $misc.prices.items[3].init({ id: 4, start: 3000, end: 4000 });
        $misc.prices.append($factory({ classes: ["PriceRange", "States"], base_class: "PriceRange" }));
        $misc.prices.items[4].init({ id: 5, start: 4000, end: 5000 });
        $misc.prices.append($factory({ classes: ["PriceRange", "States"], base_class: "PriceRange" }));
        $misc.prices.items[5].init({ id: 6, start: 5000, end: 100000, title: "от 5000 р." });

        $log.log("prices = ", $misc.prices.items);
    }
);