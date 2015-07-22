"use strict";





/**
 * Класс поля модели данных
 * @param parameters {Object} - Параметры инициализации создаваемого объекта
 * @constructor
 */
function Field (parameters) {
    this.source = "";           // Наименование поля-источника данных в БД
    this.value = undefined;     // Значение поля
    this.default_value = "";    // Значение поля по умолчанию
    this.backupable = false;    // Флаг, требуется ли резервировать значение поля
    this.required = false;      // Флаг, является ли поле обязательным для заполнения

    if (parameters !== undefined) {
        for (var param in parameters) {
            if (this.hasOwnProperty(param)) {
                this[param] = parameters[param];
            }
        }
    }
};


function Factory () {

};



/********************
 * Модуль core
 * Содержит базовые сервисы системы
 ********************/
var core = angular.module("core", [])
    .config(function ($provide) {



        /********************
         * $modules
         * Сервис, осуществляющий загрузку модулей системы
         ********************/
        $provide.factory("$modules", ["$log", "$classes", "$factory", "$menu", function ($log, $classes, $factory, $menu) {
            var modules = {};

            /**
             * Переменные сервиса
             */
            modules.items = $factory.make({ classes: ["Collection"], base_class: "Collection" });


            /**
             * Звгружает модуль/сервис в систему
             * @param module - Наименование модуля/сервиса, который требуется загрузить в систему
             * @returns {boolean} - Возвращает true в случае успешной загрузки модуля, false - в обратном случае
             */
            modules.load = function (module) {
                var result = false;
                if (module !== undefined) {
                    if (module.classes !== undefined) {
                        for (var class_ in module.classes) {
                            $classes.classes[class_] = module.classes[class_];
                            result = true;
                            $log.log("Класс " + class_ + " загружен в стек классов.");
                        }
                    }
                    if (module.menu !== undefined)
                        $menu.load(module.menu);
                } else
                    $log.error("$menu: Не указан модуль, который требуется загрузить.");
                return result;
            };


            /**
             * Выгружает заданный модуль/сервис из системы
             * @param module - Наименование модуля/сервиса, который требуется выгрузить
             * @returns {boolean} - Возвращает true в случае успешной выгрузки модуля, false - в обратном случае
             */
            modules.unload = function (module) {
                var result = false;
                if (module !== undefined) {
                    if (module.classes !== undefined) {
                        for (var class_ in module.classes) {
                            if ($classes.classes.hasOwnProperty(class_)) {
                                delete $classes.classes[class_];
                                result = true;
                            }
                        }
                    }
                } else
                    $log.error("$menu: Не указан модуль, который требуется выгрузить.");
                return result;
            };

            return modules;
        }]);



        /********************
         * $menu
         * Сервис, реализующий функционал для управления меню
         ********************/
        $provide.factory("$menu", ["$log", "$factory", function ($log, $factory) {
            var menu = {};

            /**
             * Наборы свойст и методов, описывающих модели данных
             */
            menu.classes = {

                /**
                 * MenuItem
                 * Набор свойст и методов, описывающих пункт меню
                 */
                MenuItem: {
                    id: 0,
                    title: "",
                    description: "",
                    url: "",
                    template: "",
                    controller: "",
                    active: false,
                    submenu: [],

                    /**
                     * Инициализирует пункт меню заданными параметрами
                     * @param parameters
                     */
                    init: function (parameters) {
                        if (parameters !== undefined) {
                            for (var param in parameters) {
                                if (this.hasOwnProperty(param))
                                    this[param] = parameters[param];
                            }
                        } else
                            $log.error("$menu: Не указаны параметры инициализации раздела меню.");
                    }
                }

            };


            /**
             * Переменные сервиса
             */
            menu.items = $factory.make({ classes: ["Collection"], base_class: "Collection" });
            menu.activeMenuItem = undefined;


            /**
             * Загружает раздел меню в систему
             * @param menuItem
             */
            menu.load = function (menuItem) {
                if (menuItem !== undefined) {
                    if (menuItem.__class__ !== undefined && menuItem.__class__ === "MenuItem") {
                        menu.items.append(menuItem);
                        $log.info("Раздел меню " + menuItem.title + " добавлен в стек разделов меню.");
                    }
                }
            };


            /**
             * Устанавливает раздел меню
             * @param parameters
             * @returns {boolean}
             */
            menu.set = function (parameters) {
                var result = false;
                if (parameters !== undefined) {
                    var menuItem = $factory.make({ classes: ["MenuItem"], base_class: "MenuItem" });
                    menuItem.init(parameters);
                    result = menuItem;
                }
                return result;
            };


            /**
             * Возвращает активный раздел меню
             * @returns {MenuItem} - Возвращает активный раздел меню
             */
            menu.getActive = function () {
                var result = menu.items.find("active", true);
                return result;
            };


            /**
             * Делает раздел меню с идентификатором menuItemId активным
             * @param menuItemId - Идентификатор раздела меню
             * @returns {MenuItem} - Возвращает активный раздел меню
             */
            menu.select = function (menuItemId) {
                var result = false;
                if (menuItemId !== undefined) {
                    angular.forEach(menu.items.items, function (menuItem) {
                        if (menuItem.id === menuItemId) {
                            menuItem.active = true;
                            menu.activeMenuItem = menuItem;
                            result = menuItem;
                        } else
                            menuItem.active = false;
                    });
                } else  $log.error("$menu: Не указан идентификатор раздела меню");
                return result;
            };


            return menu;
        }]);



        /********************
         * $classes
         * Сервис, содержащий описание базовых и пользовательских классов
         ********************/
        $provide.factory("$classes", [function () {
            var classes = {};

            /**
             * Наборы свойст и методов, описывающих модели данных
             */
            classes.classes = {

                /**
                 * Model
                 * Набор методов и свойств для управления моделю данных
                 */
                Model: {
                    __dependencies__: [],
                    _model_: {
                        __instance__: "",
                        db_table: "",

                        /**
                         * Производит инициализацию модели данных на основе JSON-данных
                         * @param JSONdata {JSON} - Набор JSON-данных
                         * @returns {number} - Возвращает количество полей, проинициализированных из JSON-данных
                         */
                        fromJSON: function (JSONdata) {
                            var result = 0;
                            for (var data in JSONdata) {
                                for (var prop in this.__instance__) {
                                    if (this.__instance__[prop].constructor === Field &&
                                        this.__instance__[prop].source === data) {
                                        if (isNaN(JSONdata[data]) === false)
                                            this.__instance__[prop].value = parseInt(JSONdata[data]);
                                        else
                                            this.__instance__[prop].value = JSONdata[data];
                                        result++;
                                    }
                                }
                            }
                            return result;
                        },


                        /**
                         *
                         */
                        toString: function () {
                            var result = {};
                            for (var prop in this.__instance__) {
                                if (this.__instance__[prop].constructor === Field) {
                                    result[prop] = this.__instance__[prop];
                                }
                            }
                            return JSON.stringify(result);
                        },


                        /**
                         *
                         */
                        reset: function () {
                            var result = 0;
                            for (var prop in this.__instance__) {
                                if (this.__instance__[prop].constructor === Field &&
                                    this.__instance__[prop].default_value !== undefined) {
                                    this.__instance__[prop].value = this.__instance__[prop].default_value;
                                    result++;
                                }
                            }
                            return result;
                        }
                    }
                },



                /**
                 * States
                 * Набор свойств и методов для отслеживания состояний объекта
                 */
                States: {
                    __dependencies__: [],
                    _states_: {
                        isActive: false,        // Флаг, сигнализирующий, активен ли объект
                        isSelected: false,      // Флаг, сигнализирующий, выбран ли объект
                        isChanged: false,       // Флаг, сигнализирующий, был ли изменен объект
                        isLoaded: false,        // Флаг, сигнализирующий был ли объект загружен
                        isInEditMode: false,    // Флаг, сигнализирующий, находится ли объект в режиме редактирования
                        isInDeleteMode: false,  // Флаг, сигнализирующий, находится ли объект в режиме удаления

                        /**
                         * Устанавливает / отменяет режим активного объекта
                         * @param flag {Boolean} - Флаг активности / неактивности объекта
                         * @returns {boolean} - Возвращает флаг активности / неактивности объекта
                         */
                        active: function (flag) {
                            if (flag !== undefined && flag.constructor === Boolean)
                                this.isActive = flag;
                            return this.isActive;
                        },

                        /**
                         * Устанавливает / отменяет режим редактирования объекта
                         * @param flag {Boolean} - Флаг нахождения объекта в режиме редактирования
                         * @returns {boolean} - Возвращает флаг нахождения объекта в режиме редактирования
                         */
                        editing: function (flag) {
                            if (flag !== undefined && flag.constructor === Boolean)
                                this.isInEditMode = flag;
                            return this.isInEditMode;
                        },

                        /**
                         * Устанавливает / отменяет режим удаления объекта
                         * @param flag {boolean} - Флаг нахождения объекта в режиме удаления
                         * @returns {boolean} - Возвращает флаг нахождения объекта в режиме удаления
                         */
                        deleting: function (flag) {
                            if (flag !== undefined && flag.constructor === Boolean)
                                this.isInRemoveMode = flag;
                            return this.isInRemoveMode;
                        },

                        /**
                         * Устанавливает / отменяет режим измененного объекта
                         * @param flag {boolean} - Флаг, был ли объект изменен
                         * @returns {boolean} - Возвращает флаг, был ли объект изменен
                         */
                        changed: function (flag) {
                            if (flag !== undefined && flag.constructor === Boolean)
                                this.isChanged = flag;
                            return this.isChanged;
                        },

                        /**
                         * Устанавливает / отменяет режим выбранного объекта
                         * @param flag {boolean} - Флаг, был ли выбран объект
                         * @returns {boolean} - Возвращает флаг, был ли выбран объект
                         */
                        selected: function (flag) {
                            if (flag !== undefined && flag.constructor === Boolean)
                                this.isSelected = flag;
                            return this.isSelected;
                        },

                        /**
                         * Устанавливает / отменяет режим загруженного объекта
                         * @param flag {boolean} - Флаг, был ли объект загружен
                         * @returns {boolean} - Возвращает флаг, был ли объект загружен
                         */
                        loaded: function (flag) {
                            if (flag !== undefined && flag.constructor === Boolean)
                                this.isLoaded = flag;
                            return this.isLoaded;
                        }
                    }
                },


                /**
                 * Backup
                 * Набор свойств и методов для бэкапа свойств объекта
                 */
                Backup: {
                    __dependencies__: [],
                    _backup_: {
                        __instance__: "",
                        data: {},

                        /**
                         * Устанавливает резервные значения для полей, помеченных для бэкапа
                         * @returns {number} - Возвращает количество полей, для короых созданы резервные значения
                         */
                        setup: function () {
                            var result = 0;
                            for (var prop in this.__instance__) {
                                if (this.__instance__[prop].constructor === Field && this.__instance__[prop].backupable === true) {
                                    this.data[prop] = this.__instance__[prop].value;
                                    result++;
                                }
                            }
                            return result;
                        },

                        /**
                         * Восстанавливает резервные значения полей, занесенных в бэкап
                         * @returns {number} Возвращает количество полей, для которых восстановлены резервные значения
                         */
                        restore: function () {
                            var result = 0;
                            for (var prop in this.data) {
                                if (this.__instance__[prop] !== undefined &&
                                    this.__instance__[prop].constructor === Field &&
                                    this.__instance__[prop].backupable === true) {
                                    this.__instance__[prop].value = this.data[prop];
                                    result++;
                                }
                            }
                            return result;
                        }
                    }
                },


                /**
                 * Collection
                 * Набор свойств, описывающих коллекцию объектов
                 */
                Collection: {
                    items: [],


                    /**
                     * Возвращает количество элементов в коллекции
                     * @returns {Number} - Возвращает размер коллекции
                     */
                    size: function () {
                        var result = 0;
                        result = this.items.length;
                        return result;
                    },

                    /**
                     * Выводит в консоль все элементы коллекции
                     * @returns {Number} - Возвращает количество элементов в коллекции
                     */
                    display: function () {
                        var result = this.items.length;
                        if (console !== undefined) {
                            console.log(this.items);
                        }
                        return result;
                    },

                    /**
                     * Возвращает элемент коллекции, поле field которого равен value
                     * @param field {String} - Наименование поля
                     * @param value - Значение искомого поля
                     * @returns {boolean/Any} - Возвращает искомый элемент коллекции, в противном случае false
                     */
                    find: function (field, value) {
                        var result = false;
                        var length = this.items.length;

                        /* Если требуется найти элемент коллекции по значению поля */
                        if (field !== undefined && value !== undefined) {
                            console.log("finding item by field and value");
                            for (var i = 0; i < length; i++) {
                                if (this.items[i][field] !== undefined) {
                                    if (this.items[i][field].constructor === Field) {
                                        if (this.items[i][field].value === value) {
                                            result = this.items[i];
                                        }
                                    } else {
                                        if (this.items[i][field] === value) {
                                            result = this.items[i];
                                        }
                                    }
                                }
                            }
                        }

                        /* Если требуется найти элемент коллекции по значению */
                        if (field !== undefined && value === undefined) {
                            console.log("finding item by value");
                            for (var i = 0; i < length; i++) {
                                if (this.items[i] === field) {
                                    result = this.items[i];
                                }
                            }
                        }

                        return result;
                    },


                    /**
                     * Добавляет элемент в конец коллекции
                     * @param item {Any} - Элемент, добавляемый в коллекцию
                     * @returns {boolean / Number} - Возвращает новую длину коллекции, false в случае некорректного завершения
                     */
                    append: function (item) {
                        var result = false;
                        if (item !== undefined) {
                            result = this.items.push(item);
                        }
                        return result;
                    },

                    /**
                     * Удаляет элементы по значению поля и по значению
                     * @param field {String} - Наименование поля
                     * @param value {Any} - Значение поля
                     * @returns {Number} - Возвращает количество удаленных элементов
                     */
                    delete: function (field, value) {
                        var result = 0;
                        var length = this.items.length;

                        /* Если требуется удалить элементы коллекции по полю и его значению */
                        if (field !== undefined && value !== undefined) {
                            console.log("deleting by field and value");
                            for (var i = 0; i < length; i++) {
                                if (this.items[i][field] !== undefined) {
                                    if (this.items[i][field].constructor === Field) {
                                        if (this.items[i][field].value === value) {
                                            this.items.splice(i, 1);
                                            result++;
                                        }
                                    } else {
                                        if (this.items[i][field] === value) {
                                            this.items.splice(i, 1);
                                            result++;
                                        }
                                    }
                                }
                            }
                        }

                        /* Если требуется удалить элементы по значению */
                        if (field !== undefined && value === undefined) {
                            console.log("deleting by value");
                            for (var i = 0; i < length; i++) {
                                if (this.items[i] === field) {
                                    this.items.splice(i, 1);
                                    result++;
                                }
                            }
                        }

                        return result;
                    }

                }
            };

            return classes;
        }]);



        /********************
         * $factory
         * Сервис фабрики объектов
         *******************/
        $provide.factory("$factory", ["$log", "$classes", function ($log, $classes) {
            var factory = {};

            /**
             * Собирает объект на основе заданных наборов свойств и методов
             * @param parameters {Object} - Параметры сборки объекта
             * @returns {Object} - Возвращает собранный объект
             */
            factory.make = function (parameters) {
                var result = new Factory();

                if (parameters !== undefined) {
                    result = parameters["destination"] !== undefined ? parameters["destination"] : new Object();

                    if (parameters["base_class"] !== undefined) {
                        if ($classes.classes.hasOwnProperty(parameters["base_class"]))
                            result.__class__ = parameters["base_class"];
                    }

                    if (parameters["classes"] !== undefined && parameters["classes"].constructor === Array) {
                        var classes = parameters["classes"];

                        for (var parent_class in classes) {
                            var target_class = undefined;

                            if ($classes.classes.hasOwnProperty(classes[parent_class]))
                                target_class = $classes.classes[classes[parent_class]];

                            if (target_class !== undefined) {
                                if (target_class.hasOwnProperty("__dependencies__") && target_class.__dependencies__.length > 0) {
                                    //TODO: add dependencies injection
                                } //else
                                    //console.log(classes[parent_class] + " have no dependencies");

                                for (var member in target_class) {
                                    if (target_class[member] !== undefined && target_class[member].constructor === Function) {
                                        if (result.prototype !== undefined) {
                                            if (result.prototype.constructor !== Object)
                                                result.prototype[member] = target_class[member];
                                            else
                                                result[member] = target_class[member];
                                        } else if (result.__proto__ !== undefined) {
                                            if (result.__proto__.constructor !== Object)
                                                result.__proto__[member] = target_class[member];
                                            else
                                                result[member] = target_class[member];
                                        }
                                    } else if (target_class[member] !== undefined && target_class[member].constructor !== Function) {
                                        if (member !== "__dependencies__") {
                                            result[member] = target_class[member];
                                            if (result[member]["__instance__"] !== undefined)
                                                result[member]["__instance__"] = result;
                                        }
                                    }
                                }
                            } else {
                                $log.error("$factory: Класс " + classes[parent_class] + " не найден.");
                            }
                        }
                    } else
                        $log.error("$factory: Вы не указали массив, содержащий классы, свойства и методы которых требуется наследовать.");
                }

                console.log("result object: ", result);
                return result;
            };

            return factory;
        }]);


        /**
         * $pagination
         * Сервис пагинации
         */
        $provide.factory("$pagination", ["$log", function ($log) {
            var pagination = {};


            /**
             * Переменные сервиса
             */
            pagination.totalPages = 0;
            pagination.currentPage = 0;
            pagination.itemsOnPage = 0;

            /**
             * Переход на следующую страницу
             */
            pagination.next = function () {
                if (pagination.currentPage < pagination.totalPages)
                    pagination.currentPage++;
            };

            /**
             * Переход на предыдущую страницу
             */
            pagination.previous = function () {
                if (pagination.currentPage > 1)
                    pagination.currentPage--;
            };

            /**
             * Пееходит на указанную страницу
             * @param pageNumber {umber} - номер страницы
             */
            pagination.set = function (pageNumber) {
                if (pageNumber !== undefined) {
                    if (isNaN(pageNumber) === false) {
                        if (pageNumber > 0 && pageNumber <= pagination.totalPages) {
                            pagination.currentPage = pageNumber;
                            console.log("currentPage = ", pagination.currentPage);
                        } else
                            $log.error("$pagination: Номер страницы не может быть меньше 0 и больше общего количества страниц");
                    } else
                        $log.error("$pagination: Номер страницы должен быть числовым значением");
                } else
                    $log.error("$pagination: Не указан номер страницы, на которую требуется перейти");
            };


            pagination.init = function (parameters) {
                if (parameters !== undefined) {
                    if (parameters.hasOwnProperty("itemsOnPage")) {
                        if (isNaN(parameters["itemsOnPage"]) === false) {
                            pagination.itemsOnPage = parameters["itemsOnPage"];
                        }
                    }
                    if (parameters.hasOwnProperty("itemsCount")) {
                        if (isNaN(parameters["itemsCount"]) === false) {
                            pagination.totalPages = Math.ceil(parameters["itemsCount"] / parameters["itemsOnPage"]);
                        }
                    }
                }
            };


            return pagination;
        }]);


    })
    .run(function ($modules, $classes, $menu) {
        $modules.load($classes);
        $modules.load($menu);
    });