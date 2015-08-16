"use strict";


var admControllers = angular.module("gears.admin.controllers", []);


admControllers.controller("GearsBouquetsController", ["$log", "$scope", "$flowers", "$pagination", "$misc", "$location", "$routeParams",
    function ($log, $scope, $flowers, $pagination, $misc, $location, $routeParams) {
        $scope.flowers = $flowers;
        $scope.pagination = $pagination;
        $scope.misc = $misc;

        $scope.selectReason = function (reasonId) {
            if (reasonId !== undefined) {
                $log.log("selectReason called");
                angular.forEach($misc.reasons.items, function (reason) {
                    if (reason.id.value === reasonId) {
                        if (reason._states_.selected() === false) {
                            $misc.reasons.select("id", reasonId);
                            $misc.currentReasonId = reasonId;
                            $log.log("currentReasonId = ", $misc.currentReasonId);
                        } else {
                            $misc.reasons.deselect(reason);
                            $misc.currentReasonId = 0;
                        }
                    }
                });
            }
        };

        $scope.gotoBouquet = function (bouquetId) {
            $location.url("/bouquets/" + bouquetId);
        };

        $scope.gotoAddBouquet = function () {
            $location.url("/new-bouquet");
        };

    }]);


admControllers.controller("GearsBouquetController", ["$log", "$scope", "$flowers", "$pagination", "$misc", "$location", "$routeParams", "$http", "$factory",
    function ($log, $scope, $flowers, $pagination, $misc, $location, $routeParams, $http, $factory) {
        $scope.flowers = $flowers;
        $scope.pagination = $pagination;
        $scope.misc = $misc;
        $scope.currentBouquet = undefined;
        $scope.activeTab = undefined;
        $scope.errors = [];
        $scope.inAddFlowerMode = false;
        $scope.inAddAdditionMode = false;
        $scope.newFlower = $factory({ classes: ["BouquetFlower", "Model", "Backup", "States"], base_class: "BouquetFlower" });
        $scope.newAddition = $factory({ classes: ["BouquetAddition", "Model", "Backup", "States"], base_class: "BouquetAddition" });
        $scope.tabs = [
            {
                id: 1,
                title: "Информация о букете",
                template: "templates/bouquet/bouquet-info.html",
                active: true
            },
            {
                id: 2,
                title: "Состав букета",
                template: "templates/bouquet/bouquet-content.html",
                active: false
            },
            {
                id: 3,
                title: "Категории",
                template: "templates/bouquet/bouquet-categories.html",
                active: false
            },
            {
                id: 4,
                title: "Поводы подарить букет",
                template: "templates/bouquet/bouquet-reasons.html",
                active: false
            },
            {
                id: 5,
                title: "Кому можно подарить буает",
                template: "templates/bouquet/bouquet-addressees.html",
                active: false
            }
        ];


        if ($routeParams.bouquetId !== undefined) {
            $scope.currentBouquet = $flowers.bouquets.find("id", parseInt($routeParams.bouquetId));
            $log.log("currentBouquet = ", $scope.currentBouquet);
        }

        $scope.selectTab = function (tabId) {
            if (tabId !== undefined) {
                angular.forEach($scope.tabs, function (tab) {
                    if (tab.id === tabId) {
                        tab.active = true;
                        $scope.activeTab = tab;
                    } else
                        tab.active = false;
                });
            }
        };

        $scope.changeReason = function (reasonId, value) {
            if (reasonId !== undefined && value !== undefined && value.constructor === Boolean) {
                var params = {
                    action: "changeReason",
                    data: {
                        bouquetId: $scope.currentBouquet.id.value,
                        reasonId: reasonId,
                        value: value === true ? 1 : 0
                    }
                };
                $scope.misc.reasons._states_.loaded(false);
                $http.post("serverside/controllers/bouquets.php", params)
                    .success(function (data) {
                        if (data !== undefined) {
                            if (JSON.parse(data) === "success") {
                                var reason = $scope.currentBouquet.reasons.find("id", reasonId);
                                if (reason !== false)
                                    reason.enabled = value;
                                else {
                                    $scope.currentBouquet.addReason(reasonId, value);
                                }
                            }
                        }
                        $scope.misc.reasons._states_.loaded(true);
                    }
                );
            }
        };


        $scope.changeAddressee = function (addresseeId, value) {
            if (addresseeId !== undefined && value !== undefined && value.constructor === Boolean) {
                var params = {
                    action: "changeAddressee",
                    data: {
                        bouquetId: $scope.currentBouquet.id.value,
                        addresseeId: addresseeId,
                        value: value === true ? 1 : 0
                    }
                };
                $scope.misc.addressees._states_.loaded(false);
                $http.post("serverside/controllers/bouquets.php", params)
                    .success(function (data) {
                        if (data !== undefined) {
                            if (JSON.parse(data) === "success") {
                                var addressee = $scope.currentBouquet.addressees.find("id", addresseeId);
                                if (addressee !== false)
                                    addressee.enabled = value;
                                else {
                                    $scope.currentBouquet.addAddressee(addresseeId, value);
                                }
                            }
                        }
                        $scope.misc.addressees._states_.loaded(true);
                    }
                );
            }
        };


        $scope.changeCategory = function (categoryId, value) {
            if (categoryId !== undefined && value !== undefined && value.constructor === Boolean) {
                var params = {
                    action: "changeCategory",
                    data: {
                        bouquetId: $scope.currentBouquet.id.value,
                        categoryId: categoryId,
                        value: value === true ? 1 : 0
                    }
                };
                $scope.misc.categories._states_.loaded(false);
                $http.post("serverside/controllers/bouquets.php", params)
                    .success(function (data) {
                        if (data !== undefined) {
                            if (JSON.parse(data) === "success") {
                                var category = $scope.currentBouquet.categories.find("id", categoryId);
                                if (category !== false)
                                    category.enabled = value;
                                else {
                                    $scope.currentBouquet.addCategory(categoryId, value);
                                }
                            }
                        }
                        $scope.misc.categories._states_.loaded(true);
                    }
                );
            }
        };


        $scope.addFlower = function (flowerId, amount) {
            if (flowerId !== undefined && amount !== undefined) {
                var params = {
                    action: "addFlower",
                    data: {
                        bouquetId: $scope.currentBouquet.id.value,
                        flowerId: flowerId,
                        amount: amount
                    }
                };
                $scope.newFlower._states_.loaded(false);
                $http.post("serverside/controllers/bouquets.php", params)
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                $log.log("data = ", data);
                                if (JSON.parse(data) === "success") {
                                    var temp_flower = $factory({ classes: ["BouquetFlower", "Model", "Backup", "States"], base_class: "BouquetFlower" });
                                    temp_flower.flowerId.value = flowerId;
                                    temp_flower.amount.value = amount;
                                    temp_flower._backup_.setup();
                                    $scope.currentBouquet.flowers.append(temp_flower);
                                    $scope.newFlower._model_.reset();
                                    $scope.inAddFlowerMode = false;
                                    $log.log("addFlowermode = ", $scope.inAddFlowerMode);
                                }
                            }
                        }
                        $scope.newFlower._states_.loaded(true);
                    }
                );
            }
        };



        $scope.deleteFlower = function (bouquetId, flowerId) {
            if (bouquetId !== undefined && flowerId !== undefined) {
                var params = {
                    action: "deleteFlower",
                    data: {
                        bouquetId: bouquetId,
                        flowerId: flowerId
                    }
                };
                $http.post("serverside/controllers/bouquets.php", params)
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                $log.log("data = ", data);
                                if (JSON.parse(data) === "success") {
                                    var temp_flower = $scope.currentBouquet.flowers.find("flowerId", flowerId);
                                    if (temp_flower !== false) {
                                        $scope.currentBouquet.flowers.delete("flowerId", flowerId);
                                    }
                                }
                            }
                        }
                    }
                );
            }
        };


        $scope.editFlower = function (bouquetId, flowerId, amount) {
            if (bouquetId !== undefined && flowerId !== undefined && amount !== undefined) {
                var params = {
                    action: "editFlower",
                    data: {
                        bouquetId: bouquetId,
                        flowerId: flowerId,
                        amount: amount
                    }
                };
                $http.post("serverside/controllers/bouquets.php", params)
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                $log.log("data = ", data);
                                if (JSON.parse(data) === "success") {
                                    var temp_flower = $scope.currentBouquet.flowers.find("flowerId", flowerId);
                                    if (temp_flower !== false) {
                                        temp_flower.amount.value = amount;
                                        temp_flower._states_.editing(false);
                                        temp_flower._states_.changed(false);
                                    }
                                }
                            }
                        }
                    }
                );
            }
        };


        $scope.addAddition = function (additionId, amount) {
            if (additionId !== undefined && amount !== undefined) {
                var params = {
                    action: "addAddition",
                    data: {
                        bouquetId: $scope.currentBouquet.id.value,
                        additionId: additionId,
                        amount: amount
                    }
                };
                $scope.newAddition._states_.loaded(false);
                $http.post("serverside/controllers/bouquets.php", params)
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                $log.log("data = ", data);
                                if (JSON.parse(data) === "success") {
                                    var temp_addition = $factory({ classes: ["BouquetAddition", "Model", "Backup", "States"], base_class: "BouquetAddition" });
                                    temp_addition.additionId.value = additionId;
                                    temp_addition.amount.value = amount;
                                    temp_addition._backup_.setup();
                                    $scope.currentBouquet.additions.append(temp_addition);
                                    $scope.newAddition._model_.reset();
                                    $scope.inAddAdditionMode = false;
                                }
                            }
                        }
                        $scope.newAddition._states_.loaded(true);
                    }
                );
            }
        };



        $scope.deleteAddition = function (bouquetId, additionId) {
            if (bouquetId !== undefined && additionId !== undefined) {
                var params = {
                    action: "deleteAddition",
                    data: {
                        bouquetId: bouquetId,
                        additionId: additionId
                    }
                };
                $http.post("serverside/controllers/bouquets.php", params)
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                $log.log("data = ", data);
                                if (JSON.parse(data) === "success") {
                                    var temp_addition = $scope.currentBouquet.additions.find("additionId", additionId);
                                    if (temp_addition !== false) {
                                        $scope.currentBouquet.additions.delete("additionId", additionId);
                                    }
                                }
                            }
                        }
                    }
                );
            }
        };


        $scope.editAddition = function (bouquetId, additionId, amount) {
            if (bouquetId !== undefined && additionId !== undefined && amount !== undefined) {
                var params = {
                    action: "editAddition",
                    data: {
                        bouquetId: bouquetId,
                        additionId: additionId,
                        amount: amount
                    }
                };
                $http.post("serverside/controllers/bouquets.php", params)
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                $log.log("data = ", data);
                                if (JSON.parse(data) === "success") {
                                    var temp_addition = $scope.currentBouquet.additions.find("additionId", additionId);
                                    if (temp_addition !== false) {
                                        temp_addition.amount.value = amount;
                                        temp_addition._states_.editing(false);
                                        temp_addition._states_.changed(false);
                                    }
                                }
                            }
                        }
                    }
                );
            }
        };


        $scope.save = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($scope.currentBouquet.title.value === "")
                $scope.errors.push("Вы не указали наименование букета");
            if ($scope.currentBouquet.descriptionShort.value === "")
                $scope.errors.push("Вы не указали краткое описание букета");
            if ($scope.currentBouquet.price.value === "")
                $scope.errors.push("Вы не указали стоимость букета");

            if ($scope.errors.length === 0) {
                var params = {
                    action: "save",
                    data: {
                        bouquetId: $scope.currentBouquet.id.value,
                        title: $scope.currentBouquet.title.value,
                        shortDescription: $scope.currentBouquet.descriptionShort.value,
                        fullDescription: $scope.currentBouquet.descriptionFull.value,
                        price: $scope.currentBouquet.price.value
                    }
                };
                $scope.currentBouquet._states_.loaded(false);
                $http.post("serverside/controllers/bouquets.php", params)
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                if (JSON.parse(data) === "success") {
                                    $scope.currentBouquet._states_.editing(false);
                                    $scope.currentBouquet._states_.changed(false);
                                }
                            }
                        }
                        $scope.currentBouquet._states_.loaded(true);
                    }
                );
            }
        };


    }]);


admControllers.controller("GearsFlowersController", ["$log", "$scope", "$http", "$location", "$misc", "$admin", "$factory",  function ($log, $scope, $http, $location, $misc, $admin, $factory) {
    $scope.misc = $misc;
    $scope.admin = $admin;

    $scope.save = function () {
        var temp_flower = $misc.flowers.find("id", $admin.currentFlowerId);
        var params = {
            action: "save",
            data: {
                flowerId: temp_flower.id.value,
                title: temp_flower.title.value,
                description: temp_flower.description.value,
                price:  temp_flower.price.value,
                height: temp_flower.height.value,
                country: temp_flower.country.value
            }
        };
        temp_flower._states_.loaded(false);
        $http.post("serverside/controllers/flowers.php", params)
            .success(function (data) {
                if (data !== undefined) {
                    if (data["error_code"] !== undefined) {
                        var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                        db_error.init(data);
                        db_error.display();
                    } else {
                        $log.log("data = ", JSON.parse(data));
                        if (JSON.parse(data) === "success") {
                            temp_flower._states_.editing(false);
                            temp_flower._states_.changed(false);
                        }
                    }
                    temp_flower._states_.loaded(true);
                }
            }
        );
    };

    $scope.gotoAddFlower = function () {
        $location.url("/new-flower");
    };
}]);


admControllers.controller("GearsAddFlowerController", ["$log", "$scope", "$http", "$misc", "$admin", "$factory", function ($log, $scope, $http, $misc, $admin, $factory) {
    $scope.misc = $misc;
    $scope.admin = $admin;
    $scope.flower = $factory({ classes: ["Flower", "Model", "States"], base_class: "Flower" });
    $scope.errors = [];

    $scope.add = function () {
        $scope.errors.splice(0, $scope.errors.length);
        if ($scope.flower.title.value === "")
            $scope.errors.push("Вы не указали наименование цветка");
        if ($scope.flower.price.value === "" || $scope.flower.price.value === 0)
            $scope.errors.push("Вы не указали стоимость цветка");
        if ($scope.flower.country.value === "")
            $scope.errors.push("Вы не указали страну-производителя цветка");

        if ($scope.errors.length === 0 && $scope.flower._states_.loaded() === true) {
            var params = {
                action: "add",
                data: {
                    title: $scope.flower.title.value,
                    description: $scope.flower.description.value,
                    height: $scope.flower.height.value,
                    country: $scope.flower.country.value,
                    price: $scope.flower.price.value
                }
            };
            $scope.flower._states_.loaded(false);
            $http.post("serverside/controllers/flowers.php", params)
                .success(function (data) {
                    if (data !== undefined) {
                        if (data["error_code"] !== undefined) {
                            var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                            db_error.init(data);
                            db_error.display();
                        } else {
                            var added_flower = $factory({ classes: ["Flower", "Model", "Backup", "States"], base_class: "Flower" });
                            added_flower._model_.fromJSON(data);
                            added_flower._backup_.setup();
                            $misc.flowers.append(added_flower);
                            $scope.flower._model_.reset();
                        }
                    }
                    $scope.flower._states_.loaded(true);
                }
            );
        }
    };
}]);



admControllers.controller("GearsAddBouquetController", ["$log", "$scope", "$http", "$flowers", "$admin", "$factory", function ($log, $scope, $http, $flowers, $admin, $factory) {
    $scope.flowers = $flowers;
    $scope.admin = $admin;
    $scope.bouquet = $factory({ classes: ["Bouquet", "Model", "States"], base_class: "Bouquet" });
    $scope.errors = [];

    $scope.add = function () {
        $scope.errors.splice(0, $scope.errors.length);
        if ($scope.bouquet.title.value === "")
            $scope.errors.push("Вы не указали наименование букета");
        //if ($scope.bouquet.descriptionShort.value === "")
        //    $scope.errors.push("Вы не краткое описание букета");
        if ($scope.bouquet.price.value === "" || $scope.bouquet.price.value === 0)
            $scope.errors.push("Вы не указали стоимость букета");

        if ($scope.errors.length === 0 && $scope.bouquet._states_.loaded() === true) {
            var params = {
                action: "add",
                data: {
                    title: $scope.bouquet.title.value,
                    short_description: $scope.bouquet.descriptionShort.value,
                    full_description: $scope.bouquet.descriptionFull.value,
                    price: $scope.bouquet.price.value
                }
            };
            $scope.bouquet._states_.loaded(false);
            $http.post("serverside/controllers/bouquets.php", params)
                .success(function (data) {
                    if (data !== undefined) {
                        if (data["error_code"] !== undefined) {
                            var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                            db_error.init(data);
                            db_error.display();
                        } else {
                            var added_bouquet = $factory({ classes: ["Bouquet", "Model", "Backup", "States"], base_class: "Bouquet" });
                            added_bouquet._model_.fromJSON(data);
                            added_bouquet._backup_.setup();
                            $flowers.bouquets.append(added_bouquet);
                            $scope.bouquet._model_.reset();
                        }
                    }
                    $scope.bouquet._states_.loaded(true);
                }
            );
        }
    };
}]);




admControllers.controller("GearsAdditionsController", ["$log", "$scope", "$http", "$location", "$misc", "$admin", "$factory",  function ($log, $scope, $http, $location, $misc, $admin, $factory) {
    $scope.misc = $misc;
    $scope.admin = $admin;

    $scope.save = function () {
        var temp_addition = $misc.additions.find("id", $admin.currentAdditionId);
        var params = {
            action: "save",
            data: {
                additionId: temp_addition.id.value,
                title: temp_addition.title.value,
                description: temp_addition.description.value,
                price:  temp_addition.price.value
            }
        };
        temp_addition._states_.loaded(false);
        $http.post("serverside/controllers/additions.php", params)
            .success(function (data) {
                if (data !== undefined) {
                    if (data["error_code"] !== undefined) {
                        var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                        db_error.init(data);
                        db_error.display();
                    } else {
                        $log.log("data = ", JSON.parse(data));
                        if (JSON.parse(data) === "success") {
                            temp_addition._states_.editing(false);
                            temp_addition._states_.changed(false);
                        }
                    }
                    temp_addition._states_.loaded(true);
                }
            }
        );
    };

    $scope.gotoAddAddition = function () {
        $location.url("/new-addition");
    };
}]);



admControllers.controller("GearsAddAdditionController", ["$log", "$scope", "$http", "$misc", "$admin", "$factory", function ($log, $scope, $http, $misc, $admin, $factory) {
    $scope.misc = $misc;
    $scope.admin = $admin;
    $scope.addition = $factory({ classes: ["Addition", "Model", "States"], base_class: "Addition" });
    $scope.errors = [];

    $scope.add = function () {
        $scope.errors.splice(0, $scope.errors.length);
        if ($scope.addition.title.value === "")
            $scope.errors.push("Вы не указали наименование декортивного элемента");
        if ($scope.addition.price.value === "" || $scope.addition.price.value === 0)
            $scope.errors.push("Вы не указали стоимость декоративного элемента");

        if ($scope.errors.length === 0 && $scope.addition._states_.loaded() === true) {
            var params = {
                action: "add",
                data: {
                    title: $scope.addition.title.value,
                    description: $scope.addition.description.value,
                    price: $scope.addition.price.value
                }
            };
            $scope.addition._states_.loaded(false);
            $http.post("serverside/controllers/additions.php", params)
                .success(function (data) {
                    if (data !== undefined) {
                        if (data["error_code"] !== undefined) {
                            var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                            db_error.init(data);
                            db_error.display();
                        } else {
                            var added_addition = $factory({ classes: ["Addition", "Model", "Backup", "States"], base_class: "Addition" });
                            added_addition._model_.fromJSON(data);
                            added_addition._backup_.setup();
                            $misc.additions.append(added_addition);
                            $scope.addition._model_.reset();
                        }
                    }
                    $scope.addition._states_.loaded(true);
                }
            );
        }
    };
}]);

admControllers.controller("GearsOrdersController", ["$log", "$scope", "$flowers", "$misc", "$orders", "$factory", function ($log, $scope, $flowers, $misc, $orders, $factory) {

}]);