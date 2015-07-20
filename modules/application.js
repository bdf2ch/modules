"use strict";



var application = angular.module("application", [
        "ngRoute",          // Подключаем модуль управления рутами
        "core",             // Подключаем модуль с сервисами ядра системы
        "application.titules",
        "application.nodes"
    ])
    .config(function ($provide) {

        /**
         * $application
         * Сервис приложения
         */
        $provide.factory("$application", [function () {
            var application = {};

            application.title = "Test application";
            application.description = "This is a test application provided by Shell Framework";
            application.classes = {

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

            return application;
        }]);
    })
    .run(function ($log, $application, $rootScope, $modules, $factory) {
        $modules.load($application);
        $rootScope.application = $application;
        $log.log("Welcome to " + $application.title);
        $log.log($application.description);

        var f = new $factory.make({ classes: ["Flower", "Model", "Backup", "States"], base_class: "Flower" });
        var json = {
            flower_id: 158,
            flower_title: "test flower title",
            flower_description: "test flower description"
        };
        f._backup_.setup();
        f._model_.fromJSON(json);
        console.log(f);
    });