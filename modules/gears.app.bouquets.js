"use strict";


/**
 * РњРѕРґСѓР»СЊ application.flowers
 * РЎРѕРґРµСЂР¶РёС‚ С„СѓРЅРєС†РёРѕРЅР°Р» С†РІРµС‚РѕС‡РЅРѕРіРѕ РјР°РіР°Р·РёРЅР°
 */
var flowers = angular.module("gears.app.bouquets", [])
    .config(function ($provide) {


        /**
         * $flowers
         * РЎРµСЂРІРёСЃ ...
         */
        $provide.factory("$flowers", ["$log", "$http", "$factory", "$pagination", "$misc", "$session", function ($log, $http, $factory, $pagination, $misc, $session) {
            var flowers = {};


            /**
             * РќР°Р±РѕСЂС‹ СЃРІРѕР№СЃС‚ Рё РјРµС‚РѕРґРѕРІ, РѕРїРёСЃС‹РІР°СЋС‰РёС… РјРѕРґРµР»Рё РґР°РЅРЅС‹С…
             */
            flowers.classes = {
                /**
                 * Bouquet
                 * Набор свойств и методов, описывающих букет
                 */
                Bouquet: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "",  backupable: true, required: true }),
                    descriptionShort: new Field({ source: "description_short", value: "", default_value: "", backupable: true, required: true }),
                    descriptionFull: new Field({ source: "description_full", value: "", default_value: "", backupable: true }),
                    price: new Field({ source: "price", value: 0, default_value: 0, backupable: true, required: true }),
                    imageUrl: new Field({ source: "image_url", value: "" }),
                    flowers: $factory({ classes: ["Collection"], base_class: "Collection" }),
                    additions: $factory({ classes: ["Collection"], base_class: "Collection" }),
                    reasons: $factory({ classes: ["Collection"], base_class: "Collection" }),
                    addressees: $factory({ classes: ["Collection"], base_class: "Collection" }),
                    categories: $factory({ classes: ["Collection"], base_class: "Collection" }),
                    sectionId: new Field({ source: "type_id", value: 0, default_value: 0, backupable: true, required: true }),

                    /**
                     * Р”РѕР±Р°РІР»СЏРµС‚ С†РІРµС‚РѕРє Рє РјР°СЃСЃРёРІСѓ С†РІРµС‚РѕРІ, РІС…РѕРґСЏС‰РёС… РІ Р±СѓРєРµС‚
                     * @param flowerId - Р�РґРµРЅС‚РёС„РёРєР°С‚РѕСЂ С†РІРµС‚РєР°
                     */
                    addFlower: function (flowerId) {
                        if (flowerId !== undefined) {
                            var flower = $misc.flowers.find("id", flowerId);
                            if (flower !== false) {
                                this.flowers.append(flower);
                            }
                        }
                    },

                    /**
                     * Р”РѕР±Р°РІР»СЏРµС‚ РґРµРєРѕСЂР°С‚РёРІРЅРѕРµ РѕС„РѕСЂРјР»РµРЅРёРµ Рє РјР°СЃСЃРёРІСѓ РґРµРєРѕСЂР°С‚РёРІРЅС‹С… РѕС„РѕСЂРјР»РµРЅРёР№ Р±СѓРєРµС‚Р°
                     * @param additionId - Р�РґРµРЅС‚РёС„РёРєР°С‚РѕСЂ РґРµРєРѕСЂР°С‚РёРІРЅРѕРіРѕ РѕС„РѕСЂРјР»РµРЅРёСЏ
                     */
                    addAddition: function (additionId) {
                        if (additionId !== undefined) {
                            var addition = flowers.additions.find("id", additionId);
                            if (addition !== false) {
                                this.additions.push(addition);
                            }
                        }
                    },

                    addReason: function (reasonId, value) {
                        //console.log("reasonId = ", reasonId);
                        //console.log("value = ", value);
                        if (reasonId !== undefined && value !== undefined && value.constructor === Boolean) {
                            var temp_reason = this.reasons.find("id", reasonId);
                            if (temp_reason !== false)
                                temp_reason.enabled = value;
                            else {
                                var new_reason = $factory({ classes: ["Reason", "Model"], base_class: "Reason" });
                                new_reason._model_.fromAnother($misc.reasons.find("id", reasonId));
                                new_reason.enabled = value;
                                this.reasons.append(new_reason);
                            }
                        }
                    },

                    addCategory: function (categoryId, value) {
                        //console.log("categoryId = ", categoryId);
                        //console.log("value = ", value);
                        if (categoryId !== undefined && value !== undefined && value.constructor === Boolean) {
                            var temp_category = this.categories.find("id", categoryId);
                            if (temp_category !== false)
                                temp_category.enabled = value;
                            else {
                                var new_category = $factory({ classes: ["Category", "Model"], base_class: "Category" });
                                new_category._model_.fromAnother($misc.categories.find("id", categoryId));
                                new_category.enabled = value;
                                this.categories.append(new_category);
                            }
                        }
                    },

                    haveReason: function (reasonId) {
                        var result = false;
                        var length = this.reasons.items.length;
                        if (reasonId !== undefined) {
                            for (var i = 0; i < length; i++) {
                                if (this.reasons.items[i].id.value === reasonId) {
                                    result = true;
                                }
                            }
                        }
                        return result;
                    },

                    addAddressee: function (addresseeId, value) {
                        //console.log("addresseeId = ", addresseeId);
                        //console.log("value = ", value);
                        if (addresseeId !== undefined && value !== undefined && value.constructor === Boolean) {
                            var temp_addressee = this.addressees.find("id", addresseeId);
                            if (temp_addressee !== false)
                                temp_addressee.enabled = value;
                            else {
                                var new_addressee = $factory({ classes: ["Addressee", "Model"], base_class: "Addressee" });
                                new_addressee._model_.fromAnother($misc.addressees.find("id", addresseeId));
                                new_addressee.enabled = value;
                                this.addressees.append(new_addressee);
                            }
                        }
                    }
                },


                /**
                 * РќР°Р±РѕСЂ СЃРІРѕР№СЃС‚РІ, РѕРїРёСЃС‹РІР°СЋС‰РёС… РїРѕРґР°СЂРѕРє, РїСЂРёР»Р°РіР°РµРјС‹Р№ Рє Р±СѓРєРµС‚Сѓ
                 */
                Gift: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    description: new Field({ source: "description", value: "", default_value: "", backupable: true }),
                    price: new Field({ source: "price", value: 0, default_value: 0, backupable: true, required: true })
                }
            };


            /**
             * РџРµСЂРµРјРµРЅРЅС‹Рµ СЃРµСЂРІРёСЃР°
             */
            flowers.bouquets = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            flowers.gifts = $factory({ classes: ["Collection"], base_class: "Collection" });


            flowers.init = function () {
                //$application.isLoading = true;
                var params = {
                    userId: $session.user.loggedIn() === true ? $session.user.get().id.value : 0
                };
                flowers.bouquets._states_.loaded(false);
                $http.post("serverside/controllers/init.php", params)
                    .success(function (data) {
                        if (data !== undefined) {

                            /* Р�РЅРёС†РёР°Р»РёР·Р°С†РёСЏ РјР°СЃСЃРёРІР° С†РІРµС‚РѕРІ */
                            if (data["flowers"] !== undefined) {
                                $misc.flowers.clear();
                                angular.forEach(data["flowers"], function (flower) {
                                    var temp_flower = $factory({ classes: ["Flower", "Model", "States", "Backup"], base_class: "Flower"});
                                    temp_flower._model_.fromJSON(flower);
                                    temp_flower._backup_.setup();
                                    $misc.flowers.append(temp_flower);
                                });
                                //$log.log("flowers = ", $misc.flowers.items);
                            }


                            /* Обработка списка категорий */
                            if (data["categories"] !== undefined) {
                                $misc.categories.clear();
                                angular.forEach(data["categories"], function (category) {
                                    var temp_category = $factory({ classes: ["Category", "Model", "States", "Backup"], base_class: "Category"});
                                    temp_category._model_.fromJSON(category);
                                    temp_category._backup_.setup();
                                    $misc.categories.append(temp_category);
                                });
                                //$log.log("categories = ", $misc.categories.items);
                            }


                            /* Обработка списка секций */
                            if (data["sections"] !== undefined) {
                                $misc.sections.clear();
                                angular.forEach(data["sections"], function (section) {
                                    var temp_section = $factory({ classes: ["Section", "Model", "States", "Backup"], base_class: "Section"});
                                    temp_section._model_.fromJSON(section);
                                    temp_section._backup_.setup();
                                    $misc.sections.append(temp_section);
                                });
                                $log.log("sections = ", $misc.categories.items);
                            }


                            /* Р�РЅРёС†РёР°Р»РёР·Р°С†РёСЏ РјР°СЃСЃРёРІР° РїРѕРІРѕРґРѕРІ РєСѓРїРёС‚СЊ Р±СѓРєРµС‚ */
                            if (data["reasons"] !== undefined) {
                                $misc.reasons.clear();
                                angular.forEach(data["reasons"], function (reason) {
                                    var temp_reason = $factory({ classes: ["Reason", "Model", "States", "Backup"], base_class: "Reason"});
                                    temp_reason._model_.fromJSON(reason);
                                    temp_reason._backup_.setup();
                                    $misc.reasons.append(temp_reason);
                                });
                                //$log.log("reasons = ", $misc.reasons.items);
                            }


                            /* Р�РЅРёС†РёР°Р»РёР·Р°С†РёСЏ РјР°СЃСЃРёРІР° РґРµРєРѕСЂР°С‚РёРІРЅС‹С… РѕС„РѕСЂРјР»РµРЅРёР№ */
                            if (data["additions"] !== undefined) {
                                $misc.additions.clear();
                                angular.forEach(data["additions"], function (addition) {
                                    var temp_addition = $factory({ classes: ["Addition", "Model", "States", "Backup"], base_class: "Addition"});
                                    temp_addition._model_.fromJSON(addition);
                                    temp_addition._backup_.setup();
                                    $misc.additions.append(temp_addition);
                                });
                                //$log.log("additions = ", $misc.additions.items);
                            }


                            /* Р�РЅРёС†РёР°Р»РёР·Р°С†РёСЏ РјР°СЃСЃРёРІР° РїРѕР»СѓС‡Р°С‚РµР»РµР№ Р±СѓРєРµС‚Р° */
                            if (data["addressees"] !== undefined) {
                                $misc.addressees.clear();
                                angular.forEach(data["addressees"], function (addressee) {
                                    var temp_addressee = $factory({ classes: ["Addressee", "Model", "States", "Backup"], base_class: "Addressee"});
                                    temp_addressee._model_.fromJSON(addressee);
                                    temp_addressee._backup_.setup();
                                    $misc.addressees.append(temp_addressee);
                                });
                                //$log.log("addressees = ", $misc.addressees.items);
                            }

                            /* Р�РЅРёС†РёР°Р»РёР·Р°С†РёСЏ РјР°СЃСЃРёРІР° Р±СѓРєРµС‚РѕРІ */
                            if (data["bouquets"] !== undefined) {
                                flowers.bouquets.clear();
                                angular.forEach(data["bouquets"], function (bouquet) {
                                    var temp_bouquet = $factory({ classes: ["Bouquet", "Model", "States", "Backup"], base_class: "Bouquet"});
                                    temp_bouquet._model_.fromJSON(bouquet);
                                    temp_bouquet._backup_.setup();

                                    if (bouquet["flowers"] !== undefined) {
                                        //angular.forEach(bouquet["flowers"], function (flower) {
                                        //    var flower_id = parseInt(flower["id"]);
                                        //    temp_bouquet.addFlower(flower_id);
                                        //});
                                        angular.forEach(bouquet["flowers"], function (flower) {
                                            //var flower_id = parseInt(flower["id"]);
                                            var bouquet_flower = $factory({ classes: ["BouquetFlower", "Model", "Backup", "States"], base_class: "BouquetFlower" });
                                            bouquet_flower._model_.fromJSON(flower);
                                            bouquet_flower._backup_.setup();
                                            temp_bouquet.flowers.append(bouquet_flower);
                                        });
                                    }

                                    if (bouquet["additions"] !== undefined) {
                                        angular.forEach(bouquet["additions"], function (addition) {
                                            var bouquet_addition = $factory({ classes: ["BouquetAddition", "Model", "Backup", "States"], base_class: "BouquetAddition" });
                                            bouquet_addition._model_.fromJSON(addition);
                                            bouquet_addition._backup_.setup();
                                            temp_bouquet.additions.append(bouquet_addition);
                                        });
                                    }

                                    if (bouquet["categories"] !== undefined) {
                                        angular.forEach(bouquet["categories"], function (category) {
                                            var category_id = parseInt(category["category_id"]);
                                            var value = parseInt(category["value"]) === 1 ? true : false;
                                            temp_bouquet.addCategory(category_id, value);
                                        });
                                    }

                                    if (bouquet["reasons"] !== undefined) {
                                        angular.forEach(bouquet["reasons"], function (reason) {
                                            var reason_id = parseInt(reason["reason_id"]);
                                            var value = parseInt(reason["value"]) === 1 ? true : false;
                                            temp_bouquet.addReason(reason_id, value);
                                        });
                                    }

                                    if (bouquet["addressees"] !== undefined) {
                                        angular.forEach(bouquet["addressees"], function (addressee) {
                                            var addressee_id = parseInt(addressee["addressee_id"]);
                                            var value = parseInt(addressee["value"]) === 1 ? true : false;
                                            temp_bouquet.addAddressee(addressee_id, value);
                                        });
                                    }

                                    flowers.bouquets.append(temp_bouquet);
                                });
                                //$log.log("bouquets = ", flowers.bouquets.items);
                                $pagination.init({
                                    itemsOnPage: 12
                                //    itemsCount: flowers.bouquets.size()
                                });
                            }

                            /* Р�РЅРёС†РёР°Р»РёР·Р°С†РёСЏ РјР°СЃСЃРёРІР° СЃРїРѕСЃРѕР±РѕРІ РѕРїР»Р°С‚С‹ */
                            if (data["payment_methods"] !== undefined) {
                                $misc.paymentMethods.clear();
                                angular.forEach(data["payment_methods"], function (payment_method) {
                                    var temp_payment_method = $factory({ classes: ["PaymentMethod", "Model"], base_class: "PaymentMethod"});
                                    temp_payment_method._model_.fromJSON(payment_method);
                                    $misc.paymentMethods.append(temp_payment_method);
                                });
                                //$log.log("payment methods = ", $misc.addressees.items);
                            }

                            /* Р�РЅРёС†РёР°Р»РёР·Р°С†РёСЏ РјР°СЃСЃРёРІР° СЃРїРѕСЃРѕР±РѕРІ РґРѕСЃС‚Р°РІРєРё */
                            if (data["delivery_methods"] !== undefined) {
                                $misc.deliveryMethods.clear();
                                angular.forEach(data["delivery_methods"], function (delivery_method) {
                                    var temp_delivery_method = $factory({ classes: ["DeliveryMethod", "Model"], base_class: "DeliveryMethod"});
                                    temp_delivery_method._model_.fromJSON(delivery_method);
                                    $misc.deliveryMethods.append(temp_delivery_method);
                                });
                                //$log.log("delivery methods = ", $misc.deliveryMethods.items);
                            }

                            /* Р�РЅРёС†РёР°Р»РёР·Р°С†РёСЏ РјР°СЃСЃРёРІР° РіРѕСЂРѕРґРѕРІ */
                            if (data["cities"] !== undefined) {
                                $misc.cities.clear();
                                angular.forEach(data["cities"], function (city) {
                                    var temp_city = $factory({ classes: ["City", "Model"], base_class: "City"});
                                    temp_city._model_.fromJSON(city);
                                    $misc.cities.append(temp_city);
                                });
                                //$log.log("cities = ", $misc.cities.items);
                            }

                        }
                        //$application.isLoading = false;
                        flowers.bouquets._states_.loaded(true);
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