"use strict";


var appControllers = angular.module("gears.app.controllers", []);

appControllers.controller("BouquetsController", ["$log", "$scope", "$application", "$flowers", "$pagination", "$misc", "$cart",
    function ($log, $scope, $application, $flowers, $pagination, $misc, $cart) {
        $scope.flowers = $flowers;
        $scope.pagination = $pagination;
        $scope.misc = $misc;
        $scope.cart = $cart;
        $scope.app = $application;


        /**
         * �������� ������� ����� �������� �����
         * @param reasonId
         */
        $scope.selectReason = function (reasonId) {
            if (reasonId !== undefined) {
                angular.forEach($misc.reasons.items, function (reason) {
                    if (reason.id.value === reasonId) {
                        if (reason._states_.selected() === false) {
                            $misc.reasons.select("id", reasonId);
                            $application.currentReasonId = reasonId;
                        } else {
                            $misc.reasons.deselect(reason);
                            $application.currentReasonId = 0;
                        }
                    }
                });
            }
            $log.log("currentReasonId = ", $application.currentReasonId);
        };


        $scope.selectAddressee = function (addresseeId) {
            if (addresseeId !== undefined) {
                angular.forEach($misc.addressees.items, function (addressee) {
                    if (addressee.id.value === addresseeId) {
                        if (addressee._states_.selected() === false) {
                            $misc.addressees.select("id", addresseeId);
                            $application.currentAddresseeId = addresseeId;
                        } else {
                            $misc.addressees.deselect(addressee);
                            $application.currentAddresseeId = 0;
                        }
                    }
                });
            }
            $log.log("currentAddresseeId = ", $application.currentAddresseeId);
        };


        /**
         * �������� ������� �������� ���
         * @param priceRangeId {number} - ������������� ��������� ���
         */
        $scope.selectPriceRange = function (priceRangeId) {
            if (priceRangeId !== undefined) {
                angular.forEach($misc.prices.items, function (priceRange) {
                    if (priceRange.id === priceRangeId)
                        $application.currentPriceRangeId = priceRange.id;
                });
                $log.log("currentPriceRangeId = ", $application.currentPriceRangeId);
            }
        };


        $scope.selectFlower = function (flowerId) {
            if (flowerId !== undefined) {
                angular.forEach($misc.flowers.items, function (flower) {
                    if (flower.id.value === flowerId) {
                        if (flower._states_.selected() === false) {
                            $misc.flowers.select("id", flowerId);
                        } else {
                            $misc.flowers.deselect(flower);
                        }
                    }
                });
            }
        };
    }]
);


appControllers.controller("BouquetController", ["$log", "$scope", "$cart", function ($log, $scope, $cart) {
    $scope.cart = $cart;
}]);


appControllers.controller("CartController", ["$log", "$scope", "$location", "$cart", "$flowers", function ($log, $scope, $location, $cart, $flowers) {
    $scope.flowers = $flowers;
    $log.log($cart.items);

    $scope.gotoOrder = function () {
        $location.url("/order");
    };
}]);


appControllers.controller("OrderController", ["$log", "$scope", function ($log, $scope) {

}]);


appControllers.controller("BouquetController", ["$log", "$scope", "$routeParams", "$flowers", "$misc", function ($log, $scope, $routeParams, $flowers, $misc) {
    $scope.flowers = $flowers;
    $scope.misc = $misc;
    $scope.bouquet = undefined;
    $scope.bouquetPriceRangeId = 0;

    $log.log($routeParams);

    if ($routeParams.bouquetId !== undefined) {
        $scope.bouquet = $flowers.bouquets.find("id", parseInt($routeParams.bouquetId));
        angular.forEach($misc.prices.items, function (price) {
            if ($scope.bouquet.price.value >= price.start && $scope.bouquet.price.value <= price.end)
                $scope.bouquetPriceRangeId = price.id;
        });
    }

    $log.log("currentBouquet = ", $scope.bouquet);
}]);



appControllers.controller("OrderController", ["$log", "$scope", "$location", "$cart", "$factory", "$misc", "$orders", function ($log, $scope, $location, $cart, $factory, $misc, $orders) {
    $scope.cart = $cart;
    $scope.misc = $misc;
    $scope.orders = $orders;
    $scope.order = $factory({ classes: ["Order", "Model", "Backup", "States"], base_class: "Order" });
    $scope.errors = {
        customer: {
            name: false,
            fname: false,
            surname: false,
            phone: false,
            email: false
        },
        reciever: {
            name: false,
            fname: false,
            surname: false,
            phone: false
        },
        address: {
            street: false,
            building: false,
            flat: false
        },
        delivery: {
            date: false
        }
    };
    $scope.errorCounter = 0;


    $scope.order.customerName.value = "Евлампий";
    $scope.order.customerFname.value = "Алибардович";
    $scope.order.customerSurname.value = "Косоглазовский";
    $scope.order.customerPhone.value = "+7 (921) 555-66-789";
    $scope.order.customerEmail.value = "fuckingemail@email.com";
    $scope.order.comment.value = "Комментарий к заказу комментарий к заказу комментарий к заказу комментарий к заказу комментарий к заказу";
    $scope.order.recieverSurname.value = "Константинопольский";
    $scope.order.recieverName.value = "Константин";
    $scope.order.recieverFname.value = "Константинович";
    $scope.order.recieverPhone.value = "+7 (921) 666-55-423";
    $scope.order.addressStreet.value = "Героев Рыбачьего";
    $scope.order.addressBuilding.value = "202";
    $scope.order.addressBuildingIndex.value = "";
    $scope.order.addressFlat.value = "112";


    /* Переход на главную страницу */
    $scope.gotoMain = function () {
        $location.url("/");
    };

    /*** Валидация формы заказа ***/
    $scope.validate = function () {
        $scope.errorCounter = 0;
        /* Имя заказчика */
        if ($scope.order.customerName.value === "") {
            $scope.errors.customer.name = "Вы не указали Ваше имя";
            $scope.errorCounter++;
        } else
            $scope.errors.customer.name = false;

        /* Отчество заказчика */
        if ($scope.order.customerFname.value === "") {
            $scope.errors.customer.fname = "Вы не указали Ваше отчество";
            $scope.errorCounter++;
        } else
            $scope.errors.customer.fname = false;

        /* Фамилия заказчика */
        if ($scope.order.customerSurname.value === "") {
            $scope.errors.customer.surname = "Вы не указали Вашу фамилию";
            $scope.errorCounter++;
        } else
            $scope.errors.customer.surname = false;

        /* Контактный телефон заказчика */
        if ($scope.order.customerPhone.value === "") {
            $scope.errors.customer.phone = "Вы не указали Ваш контактный телефон";
            $scope.errorCounter++;
        } else
            $scope.errors.customer.phone = false;

        /* Электронная почта заказчика */
        if ($scope.order.customerEmail.value === "") {
            $scope.errors.customer.email = "Вы не указали Ваш e-mail";
            $scope.errorCounter++;
        } else
            $scope.errors.customer.email = false;

        /* Если заказчик и получатель - это одно лицо */
        if ($scope.order.customerIsReciever.value === false) {

            /* Имя получателя */
            if ($scope.order.recieverName.value === "") {
                $scope.errors.reciever.name = "Вы не указали имя получателя";
                $scope.errorCounter++;
            } else
                $scope.errors.reciever.name = false;

            /* Отчетчво заказчика */
            if ($scope.order.recieverFname.value === "") {
                $scope.errors.reciever.fname = "Вы не указали отчество получателя";
                $scope.errorCounter++;
            } else
                $scope.errors.reciever.fname = false;

            /* Фамилия заказчика */
            if ($scope.order.recieverSurname.value === "") {
                $scope.errors.reciever.surname = "Вы не указали фамилию получателя";
                $scope.errorCounter++;
            } else
                $scope.errors.reciever.surname = false;

            /* Контактный телефон заказчика */
            if ($scope.order.recieverPhone.value === "") {
                $scope.errors.reciever.phone = "Вы не указали контактный телефон получателя";
                $scope.errorCounter++;
            } else
                $scope.errors.reciever.phone = false;
        }

        /* Если выбрана доставка курьером */
        if ($scope.order.deliveryMethodId.value === 2) {
            /* Адрес доставки - улица */
            if ($scope.order.addressStreet.value === "") {
                $scope.errors.address.street = "Вы не указали улицу";
                $scope.errorCounter++;
            } else
                $scope.errors.address.street = false;

            /* Адрес доставки - дом */
            if ($scope.order.addressBuilding.value === "") {
                $scope.errors.address.building = "Вы не указали номер дома";
                $scope.errorCounter++;
            } else
                $scope.errors.address.building = false;

            /* Адрес доставки - квартира */
            if ($scope.order.addressFlat.value === "") {
                $scope.errors.address.flat = "Вы не указали номер квартиры";
                $scope.errorCounter++;
            } else
                $scope.errors.address.flat = false;

            /* Дата и время доставки */
            //if ($scope.deliveryDate === "") {
            //    $scope.errors.delivery.date = "Вы не указали дату доставки";
            //    $scope.errorCounter++;
            //} else
            //    $scope.errors.delivery.date = false;
        }

        if ($scope.errorCounter === 0) {
            //$scope.order.deliveryStart.value = parseInt(moment($scope.deliveryDate + " ," + $scope.deliveryHours + ":" + $scope.deliveryMinutes, "DD.MM.YYYY, HH:mm").unix());
            $location.url("/confirm");
        }
    };

}]);



appControllers.controller("ConfirmationController", ["$log", "$scope", "$orders", "$cart", "$misc", "$location", function ($log, $scope, $orders, $cart, $misc, $location) {
    $scope.cart = $cart;
    $scope.orders = $orders;
    $scope.misc = $misc;

    $scope.orderIsConfirmed = false;
    $scope.accountIsCreated = false;

    /* Переход к странице оформления заказа */
    $scope.gotoOrder = function () {
        $location.url("/order");
    };

    $log.log($scope.orders.order);

}]);