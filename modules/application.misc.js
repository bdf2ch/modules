"use strict";



var nisc = angular.module("application.misc", [])
    .config(function ($provide) {
        $provide.factory("$misc", ["$log", "$factory", function ($log, $factory) {
            var misc = {};


            /**
             * ������ ������ � �������, ����������� ������ ������
             */
            misc.classes = {
                /**
                 * Reason
                 * ����� �������, ����������� ����� ��� ������� ������
                 */
                Reason: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    imageUrl: new Field({ source: "image_url", value: "", default_value: "", backupable: true, required: true })
                },

                /**
                 * Addressee
                 * ����� �������, ����������� ����������� ������
                 */
                Addressee: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    imageUrl: new Field({ source: "image_url", value: "", default_value: "", backupable: true, required: true })
                },

                /**
                 * PaymentMethod
                 * ����� �������, ����������� ������ ������
                 */
                PaymentMethod: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true })
                },

                /**
                 * DeliveryMethod
                 * ����� ������, ����������� ������ ��������
                 */
                DeliveryMethod: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    price: new Field({ source: "price", value: 0, default_value: 0, backupable: true, required: true })
                },

                /**
                 * City
                 * ����� �������, ����������� �����
                 */
                City: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true })
                }
            };


            /**
             * ���������� �������
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