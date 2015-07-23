"use strict";



var nisc = angular.module("application.misc", [])
    .config(function ($provide) {
        $provide.factory("$misc", ["$log", "$f", function ($log, $f) {
            var misc = {};


            misc.classes = {
                /**
                 * Reason
                 * Набор свойств, описывающих повод для покупки букета
                 */
                Reason: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    imageUrl: new Field({ source: "image_url", value: "", default_value: "", backupable: true, required: true })
                },

                /**
                 * Addressee
                 * Набор свойств, описывающих аполучателя букета
                 */
                Addressee: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    imageUrl: new Field({ source: "image_url", value: "", default_value: "", backupable: true, required: true })
                }
            };


            /**
             * Переменные сервиса
             */
            misc.reasons = $f({ classes: ["Collection"], base_class: "Collection" });
            misc.addressees = $f({ classes: ["Collection"], base_class: "Collection" });

            return misc;
        }]) ;
    })
    .run(function ($modules, $misc) {
        $modules.load($misc);
    }
);