"use strict";


var appOrders = angular.module("gears.app.orders", [])
    .config(function ($provide) {
        $provide.factory("$orders", ["$log", "$http", "$factory", function ($log, $http, $factory) {
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
                                if (data["order"] !== undefined) {
                                    var temp_order = $factory({ classes: ["Order", "Model", "Backup", "States"], base_class: "Order" });
                                    temp_order._model_.fromJSON(data["order"]);
                                    temp_order._backup_.setup();
                                    orders.items.append(temp_order);
                                }
                                if (data["user"] !== undefined) {
                                    var temp_user = $factory({ classes: ["CurrentUser", "Model", "Backup", "States"], base_class: "CurrentUser" });
                                }
                            } else {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            }
                        }
                    }
                );
            };

            orders.add = function (order, userId, callback) {
                if (order !== undefined && userId !== undefined) {
                    var params = {
                        action: "add",
                        data: {
                            userId: userId,
                            customerGenderId: order.customerGenderId.value,
                            customerName: order.customerName.value,
                            customerFname: order.customerFname.value,
                            customerSurname: order.customerSurname.value,
                            customerEmail: order.customerEmail.value,
                            customerPhone: order.customerPhone.value,
                            recieverGenderId: order.recieverGenderId.value,
                            recieverName: order.recieverName.value,
                            recieverFname: order.recieverFname.value,
                            recieverSurname: order.recieverSurname.value,
                            recieverPhone: order.recieverPhone.value,
                            addressCityId: order.addressCityId.value,
                            addressStreet: order.addressStreet.value,
                            addressBuilding: order.addressBuilding.value,
                            addressBuildingIndex: order.addressBuildingIndex.value,
                            addressFlat: order.addressFlat.value,
                            deliveryMethodId: order.deliveryMethodId.value,
                            paymentMethodId: order.paymentMethodId.value,
                            customerIsReciever: order.customerIsReciever.value === true ? 1 : 0,
                            deliveryStartPeriod: order.deliveryStartPeriod.value,
                            deliveryEndPeriod: order.deliveryEndPeriod.value,
                            comment: order.comment.value
                        }
                    };
                    //$application.currentOrder._states_.loaded(false);
                    $http.post("serverside/controllers/orders.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                            //$application.currentOrder._states_.loaded(true);
                        }
                    );
                }
            };

            return orders;
        }]);
    })
    .run(function ($log, $modules, $orders) {
        $modules.load($orders);
    }
);