"use strict";



var misc = angular.module("gears.app.misc", [])
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
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true}),
                    description: new Field({ source: "description", value: "", default_value: "", backupable: true, required: true }),
                    price: new Field({ source: "price", value: 0, default_value: 0, backupable: true, required: true }),
                    imageUrl: new Field({ source: "image_url", value: "", default_value: "" }),
                    height: new Field({ source: "height", value: "", default_value: "", backupable: true }),
                    country: new Field({ source: "country", value: "", default_value: "", backupable: true, required: true }),
                    display: "",

                    _init_: function () {
                        this.display = this.title.value;
                        if (this.height.value !== "")
                            this.display += ", " + this.height.value + " см";
                        if (this.country.value !== "")
                            this.display += " (" + this.country.value + ")";
                        this.display += " [" + this.price.value + "]";
                    }

                },

                /**
                 * BouquetFlower
                 * Набор свойст описывающих цветок в составе букета
                 */
                BouquetFlower: {
                    flowerId: new Field({ source: "flower_id", value: 0, default_value:0  }),
                    amount: new Field({ source: "amount", value: 0, default_value: 0, backupable: true, required: true })
                },

                /**
                 * Addition
                 * Набор свойств, описывающих декоративное оформление букета
                 */
                Addition: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    description: new Field({ source: "description", value: "", default_value: "", backupable: true }),
                    price: new Field({ source: "price", value: 0, default_value: 0, backupable: true, required: true }),
                    imageUrl: new Field({ source: "image_url", value: "", default_value: "", backupable: true }),
                    display: "",

                    _init_: function () {
                        this.display = this.title.value + " (" + this.price.value + " р.)";
                    }
                },

                /**
                 * BouquetAddition
                 * Набор свойст, описывающих декоративное оформление в составе букета
                 */
                BouquetAddition: {
                    additionId: new Field({ source: "addition_id", value: 0, default_value: 0 }),
                    amount: new Field({ source: "amount", value: 0, default_value: 0, backupable: true, required: true })
                },

                /**
                 * Reason
                 * Набор свойств, описывающих повод для покупки букета
                 */
                Reason: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    imageUrl: new Field({ source: "image_url", value: "", default_value: "", backupable: true, required: true }),
                    position: new Field({ source: "position", value: 0, default_value: 0, backupable: true, required: true }),
                    enabled: false
                },

                /**
                 * Category
                 * Набор свойст, описывающих категорию букета
                 */
                Category: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    description : new Field({ source: "description", value: "", default_value: "", backupable: true }),
                    imageUrl: new Field({ source: "iamge_url", value: "", default_value: "", backupable: true }),
                    position: new Field({ source: "position", value: 0, default_value: 0, backupable: true }),
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
                },

                /**
                 * Gender
                 * Набор свойств, опичывающих пол
                 */
                Gender: {
                    id: 0,
                    title: "",

                    init: function (parameters) {
                        if (parameters !== undefined) {
                            for (var param in parameters) {
                                if (this.hasOwnProperty(param))
                                    this[param] = parameters[param];
                            }
                        }
                    }
                },

                /**
                 * Section
                 * Набор свойст, описывающих раздел приложения
                 */
                Section: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "" }),
                    description: new Field({ source: "description", value: "", default_value: "" })
                }
            };


            /**
             * Переменные сервиса
             */
            misc.flowers = $factory({ classes: ["Collection"], base_class: "Collection" });
            misc.additions = $factory({ classes: ["Collection"], base_class: "Collection" });
            misc.reasons = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            misc.categories = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            misc.addressees = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            misc.paymentMethods = $factory({ classes: ["Collection"], base_class: "Collection" });
            misc.deliveryMethods = $factory({ classes: ["Collection"], base_class: "Collection" });
            misc.cities = $factory({ classes: ["Collection"], base_class: "Collection" });
            misc.prices = $factory({ classes: ["Collection"], base_class: "Collection" });
            misc.genders = $factory({ classes: ["Collection"], base_class: "Collection" });
            misc.slides = [
                {
                    image: "resources/img/promo.jpg",
                    url: "#/order"
                },
                {
                    image: "resources/img/promo2.jpg",
                    url: "#/confirm"
                },
                {
                    image: "resources/img/promo3.jpg",
                    url: "#/account"
                }
            ];

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

        $misc.genders.append($factory({ classes: ["Gender", "States"], base_class: "Gender" }));
        $misc.genders.items[0].init({ id: 1, title: "Уважаемый" });
        $misc.genders.append($factory({ classes: ["Gender", "States"], base_class: "Gender" }));
        $misc.genders.items[1].init({ id: 2, title: "Уважаемая" });

        $misc.flowers.multipleSelect(true);

        $log.log("prices = ", $misc.prices.items);
    }
);