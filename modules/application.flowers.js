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
        $provide.factory("$flowers", ["$log", "$http", "$factory", "$pagination", function ($log, $http, $factory, $pagination) {
            var flowers = {};


            /**
             * Наборы свойст и методов, описывающих модели данных
             */
            flowers.classes = {

                /**
                 * Набор свойств, описывающих цветок
                 */
                Flower: {
                    id: new Field({source: "flower_id", value: 15, backupable: true}),
                    title: new Field({source: "flower_title", value: "rose", backupable: true, required: true}),
                    description: new Field({
                        source: "flower_description",
                        value: "flower description",
                        backupable: true
                    }),
                    price: new Field({source: "flower_price", value: 750, backupable: true, required: true})
                },

                /**
                 * Набор свойств, описывающих материал оформления букета
                 */
                Addition: {
                    id: new Field({source: "addition_id", value: 0, backupable: true}),
                    title: new Field({
                        source: "addition_title",
                        value: "addition_title",
                        backupable: true,
                        required: true
                    }),
                    description: new Field({
                        source: "addition_description",
                        value: "addition description",
                        backupable: true
                    })
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
                    imageUrl: new Field({ source: "image_url", value: "" })
                },

                /**
                 * Набор свойств, описывающих подарок, прилагаемый к букету
                 */
                Gift: {
                    id: new Field({source: "gift_id", value: 16, backupable: true}),
                    title: new Field({source: "gift_title", value: "gift_title", backupable: true, required: true}),
                    description: new Field({source: "gift_description", value: "gift description", backupable: true}),
                    price: new Field({source: "gift_title", value: 1250, backupable: true, required: true})
                }

            };


            /**
             * Переменные сервиса
             */
            flowers.flowers = $factory.make({ classes: ["Collection"], base_class: "Collection" });
            flowers.bouquets = $factory.make({ classes: ["Collection"], base_class: "Collection" });
            flowers.additions = $factory.make({ classes: ["Collection"], base_class: "Collection" });


            flowers.init = function () {
                $http.post("serverside/controllers/init.php", {})
                    .success(function (data) {
                        if (data !== undefined) {

                            /* Инициализация массива букетов */
                            if (data["bouquets"] !== undefined) {
                                angular.forEach(data["bouquets"], function (bouquet) {
                                    //$log.log(bouquet);
                                    temp_bouquet = new Factory();
                                    //temp_bouquet = $factory.make({ classes: ["Bouquet", "Model"], base_class: "Bouquet"});
                                    //temp_bouquet._model_.fromJSON(bouquet);
                                    //flowers.bouquets.append(temp_bouquet);
                                    //flowers.bouquets.append(flowers.bouquets.append(temp_bouquet));
                                    //temp_bouquet = null;

                                    flowers.bouquets.append($factory.make({ classes: ["Bouquet", "Model"], base_class: "Bouquet", destination: temp_bouquet }));
                                    flowers.bouquets.items[flowers.bouquets.size() - 1]._model_.fromJSON(bouquet);
                                });
                                $log.log(flowers.bouquets.items);
                                $pagination.init({
                                    itemsOnPage: 12,
                                    itemsCount: flowers.bouquets.size()
                                });
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



flowers.controller("BouquetsController", ["$log", "$scope", "$flowers", "$pagination", function ($log, $scope, $flowers, $pagination) {
    $scope.flowers = $flowers;
    $scope.pagination = $pagination;
}]);