"use strict";


var appOrders = angular.module("gears.app.orders", [])
    .config(function ($provide) {
        $provide.factory("$orders", ["$log", "$http", "$application", "$cart", "$factory", function ($log, $http, $application, $cart, $factory) {
            var orders = {};

            orders.classes = {
                /**
                 * Order
                 * Набор свойств, описывающих заказ
                 */
                Order: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    userId: new Field({ source: "user_id", value: 0, default_value: 0 }),
                    customerGenderId: new Field({ source: "customer_gender_id", value: 1, default_value: 1 }),
                    customerName: new Field({ source: "customer_name", value: "", default_value: "" }),
                    customerFname: new Field({ source: "customer_fname", value: "", default_value: "" }),
                    customerSurname: new Field({ source: "customer_surname", value: "", default_value: "" }),
                    customerPhone: new Field({ source: "customer_phone", value: "", default_value: "" }),
                    customerEmail: new Field({ source: "customer_email", value: "", default_value: "" }),
                    recieverGenderId: new Field({ source: "reciever_gender_id", value: 1, default_value: 1 }),
                    recieverName: new Field({ source: "reciever_name", value: "", default_value: "" }),
                    recieverFname: new Field({ source: "reciever_fname", value: "", default_value: "" }),
                    recieverSurname: new Field({ source: "reciever_surname", value: "", default_value: "" }),
                    recieverPhone: new Field({ source: "reciever_phone", value: "", default_value: "" }),
                    addressCityId: new Field({ source: "address_city_id", value: 1, default_value: 1 }),
                    addressStreet: new Field({ source: "address_street", value: "", default_value: "" }),
                    addressBuilding: new Field({ source: "address_building", value: "", default_value: "" }),
                    addressBuildingIndex: new Field({ source: "address_building_index", value: "", default_value: "" }),
                    addressFlat: new Field({ source: "address_flat", value: "", default_value: "" }),
                    deliveryMethodId: new Field({ source: "delivery_method_id", value: 1, default_value: 1 }),
                    paymentMethodId: new Field({ source: "payment_method_id", value: 1, default_value: 1 }),
                    customerIsReciever: new Field({ source: "customer_is_reciever", value: true, default_value: true }),
                    deliveryStartPeriod: new Field({ source: "delivery_start_period", value: 0, default_value: 0 }),
                    deliveryEndPeriod: new Field({ source: "delivery_end_period", value: 0, default_value: 0 }),
                    comment: new Field({ source: "comment", value: "", default_value: "" }),
                    created: new Field({ source: "created", value: 0, default_value: 0 })
                }
            };

            orders.items = $factory({ classes: ["Collection"], base_class: "Collection" });


            orders.get = function () {
                var params = {
                    action: "query",
                    data: {
                        userId: 12
                    }
                };
                $http.post("serverside/controllers/orders.php", params)
                    .success(function (data) {
                        if (data === undefined) {
                            if (data["error_code"] !== undefined) {
                                 $log.log(data);
                            } else {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            }
                        }
                    }
                );
            };

            orders.add = function () {
                var params = {

                };
                $http.post("serverside/controllers/orders.php", params)
                    .success(function (data) {

                    }
                );
            };

            return orders;
        }]);
    })
    .run(function ($log, $modules, $orders, $factory) {
        $modules.load($orders);

        $orders.order = $factory({ classes: ["Order", "Model", "Backup", "States"], base_class: "Order" });
        $log.log("order = ", $orders.order);

        $orders.order.customerName.value = "Евлампий";
        $orders.order.customerFname.value = "Алибардович";
        $orders.order.customerSurname.value = "Косоглазовский";
        $orders.order.customerPhone.value = "+7 (921) 555-66-789";
        $orders.order.customerEmail.value = "fuckingemail@email.com";
        $orders.order.comment.value = "Комментарий к заказу комментарий к заказу комментарий к заказу комментарий к заказу комментарий к заказу";
        $orders.order.recieverSurname.value = "Константинопольский";
        $orders.order.recieverName.value = "Константин";
        $orders.order.recieverFname.value = "Константинович";
        $orders.order.recieverPhone.value = "+7 (921) 666-55-423";
        $orders.order.addressStreet.value = "Героев Рыбачьего";
        $orders.order.addressBuilding.value = "202";
        $orders.order.addressBuildingIndex.value = "";
        $orders.order.addressFlat.value = "112";
        $orders.get();
    }
);