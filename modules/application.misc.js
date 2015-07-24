"use strict";



var nisc = angular.module("application.misc", [])
    .config(function ($provide) {
        $provide.factory("$misc", ["$log", "$factory", function ($log, $factory) {
            var misc = {};


            /**
             * Ќаборы свойст и методов, описывающих модели данных
             */
            misc.classes = {
                /**
                 * Reason
                 * Ќабор свойств, описывающих повод дл€ покупки букета
                 */
                Reason: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    imageUrl: new Field({ source: "image_url", value: "", default_value: "", backupable: true, required: true })
                },

                /**
                 * Addressee
                 * Ќабор свойств, описывающих аполучател€ букета
                 */
                Addressee: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    imageUrl: new Field({ source: "image_url", value: "", default_value: "", backupable: true, required: true })
                },

                /**
                 * PaymentMethod
                 * Ќабор свойств, описывающих способ оплаты
                 */
                PaymentMethod: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true })
                },

                /**
                 * DeliveryMethod
                 * Ќабор свойст, описывающих способ доставки
                 */
                DeliveryMethod: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    price: new Field({ source: "price", value: 0, default_value: 0, backupable: true, required: true })
                },

                /**
                 * City
                 * Ќабор свойств, описывающих город
                 */
                City: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true })
                }
            };


            /**
             * ѕеременные сервиса
             */
            misc.reasons = $factory({ classes: ["Collection"], base_class: "Collection" });
            misc.addressees = $factory({ classes: ["Collection"], base_class: "Collection" });
            misc.paymentMethods = $factory({ classes: ["Collection"], base_class: "Collection" });
            misc.deliveryMethods = $factory({ classes: ["Collection"], base_class: "Collection" });
            misc.cities = $factory({ classes: ["Collection"], base_class: "Collection" });

            return misc;
        }]) ;
    })
    .run(function ($modules, $misc) {
        $modules.load($misc);
    }
);