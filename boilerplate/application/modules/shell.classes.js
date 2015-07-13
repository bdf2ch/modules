"use strict";

/**
 * Модуль shell.classes
 * Определяет сервис $shellClasses, содержащий описание классов, используемых в приложении
 */
var shellClasses = angular.module("shell.classes", [])
    .config(function ($provide) {

        /**
         * $shellClasses
         * Содержит описание классов, используемых в приложении
         */
        $provide.factory("$shellClasses", [function () {
            var shellClasses = {};

            shellClasses.classes = {

                /**
                 * Набор свойств, описывающих цветок
                 */
                Flower: {
                    id: new Field({ source: "flower_id", value: 15, backupable: true }),
                    title: new Field({ source: "flower_title", value: "rose", backupable: true }),
                    description: new Field({ source: "flower_description", value: "flower description", backupable: true }),
                    price: new Field({ source: "flower_price", value: 750, backupable: true })
                },

                /**
                 * Набор свойств, описывающих материал оформления букета
                 */
                Addition: {
                    id: new Field({ source: "addition_id", value: 0, backupable: true }),
                    title: new Field({ source: "addition_title", value: "addition_title", backupable: true }),
                    description: new Field({ source: "addition_description", value: "addition description", backupable: true })
                },

                /**
                 * Набор свойств, описывающих букет
                 */
                Bouquet: {
                    id: new Field({ source: "bouquet_id", value: 0, backupable: true }),
                    title: new Field({ source: "bouquet_title", value: "bouquet title", backupable: true }),
                    description: new Field({ source: "bouquet_description", value: "bouquet description", backupable: true })
                },

                /**
                 * Набор свойств, описывающих подарок, прилагаемый к букету
                 */
                Gift: {
                    id: new Field({ source: "gift_id", value: 16, backupable: true }),
                    title: new Field({ source: "gift_title", value: "gift_title", backupable: true }),
                    description: new Field({ source: "gift_description", value: "gift description", backupable: true }),
                    price: new Field({ source: "gift_title", value: 1250, backupable: true })
                }
            };

            return shellClasses;
        }]);
    })
    .run(function () {

    }
);
