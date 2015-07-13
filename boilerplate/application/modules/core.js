"use strict";


var coreClasses = angular.module("core.classes", [])
    .config(function ($provide) {


        /**
         * $factory
         * Фабрика объектов
         */
        $provide.factory("$factory", ["$log", "$coreClasses", "$shellClasses", function ($log, $coreClasses, $shellClasses) {
            var factory = {};

            factory.make = function (parameters) {
                var result = undefined;

                /**
                 * Если при вызове фабрики были заданы параметры инициализации
                 */
                if (parameters !== undefined) {
                    /**
                     * Если в параметрах инициализации задан объект-приемник, то добавляем желаемые свойства и методы к нему,
                     * в противном случае - создаем новый объект и добавляем желаемые свойства и методы к новому объекту
                     */
                    result = parameters["destination"] !== undefined ? parameters["destination"] : {};

                    /**
                     * Если в параметрах инициализации задан базовый класс, то устанавливаем у объекта свойство class
                     */
                    if (parameters["base_class"] !== undefined) {
                        if ($coreClasses.classes.hasOwnProperty(parameters["base_class"]) ||
                            $shellClasses.classes.hasOwnProperty(parameters["base_class"]))
                            result.__class__ = parameters["base_class"];
                    }

                    //console.log("destination object: ", result);

                    /**
                     * Если в параметрах инициализации указан массив с перечислением классов, свойства и методы которых требуется
                     * унаследовать - производим установку свойств и методов этих классов к результирующему объекту
                     */
                    if (parameters["classes"] !== undefined && parameters["classes"].constructor === Array) {
                        var classes = parameters["classes"];

                        /* Обходим все базовые классы из массива наследуемых классов */
                        for (var parent_class in classes) {
                            //console.log("parent class = ", classes[parent_class]);

                            var target_class = undefined;

                            /**
                             * Если запрашиваемый класс существует в $coreClasses, то сохраняем на него ссылку.
                             * Если запрашиваемый класс существует в $shellClasses, то сохраняем ссылку на него.
                             */
                            if ($coreClasses.classes.hasOwnProperty(classes[parent_class]))
                                target_class = $coreClasses.classes[classes[parent_class]];
                            else if ($shellClasses.classes.hasOwnProperty(classes[parent_class]))
                                target_class = $shellClasses.classes[classes[parent_class]];

                            //console.log("target class = ", target_class);


                            /* Если запрашиваемый класс найден в $coreClasses или в $shellClasses */
                            if (target_class !== undefined) {

                                /* Если текущий класс имеет зависимости от других классов */
                                if (target_class.hasOwnProperty("__dependencies__") &&
                                    target_class.__dependencies__.length > 0) {
                                    //TODO: add dependencies injection
                                    console.log(classes[parent_class] + " have dependencies");
                                } else
                                    console.log(classes[parent_class] + " have no dependencies");

                                /* Обходим все члены базового класса */
                                for (var member in target_class) {

                                    /* Если текущим членом базового класса является функция */
                                    if (target_class[member] !== undefined &&
                                        target_class[member].constructor === Function) {

                                        /* Если у объекта-приемника доступно свойство prototype */
                                        if (result.prototype !== undefined) {
                                            /**
                                             * Если родителем объекта-приемника не является Object,
                                             * тогда устанавливаем метод для всех наследников объекта
                                             * Если родителем объекта-приемника является Object,
                                             * тогда устанавливаем метод только для экземпляра объекта
                                             */
                                            if (result.prototype.constructor !== Object)
                                                result.prototype[member] = target_class[member];
                                            else
                                                result[member] = target_class[member];

                                        } else if (result.__proto__ !== undefined) {
                                            /**
                                             * Если родителем объекта-приемника не является Object,
                                             * тогда устанавливаем метод для всех наследников объекта
                                             * Если родителем объекта-приемника является Object,
                                             * тогда устанавливаем метод только для экземпляра объекта
                                             */
                                            if (result.__proto__.constructor !== Object)
                                                result.__proto__[member] = target_class[member];
                                            else
                                                result[member] = target_class[member];
                                        }
                                        /* Если текущим членом базового класса является свойство */
                                    } else if (target_class[member] !== undefined &&
                                        target_class[member].constructor !== Function) {
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
         * $coreClasses
         * Набор базовых системных классов
         */
        $provide.factory("$coreClasses", [function () {
            var coreClasses = {};

            coreClasses.classes = {

                /**
                 * Testclass
                 * Тестовый класс
                 */
                Testclass: {
                    __dependencies__: [],
                    testclass_prop_one: "testprop",
                    testclass_prop_two: 64,
                    func_one: function () {},
                    func_two: function () {}
                },


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
                                console.log("data = ", data);
                                for (var prop in this.__instance__) {
                                    if (this.__instance__[prop].constructor === Field &&
                                        this.__instance__[prop].source === data) {
                                        console.log(prop);
                                        if (isNaN(JSONdata[data]) === false)
                                            this.__instance__[prop].value = parseInt(JSONdata[data]);
                                        else
                                            this.__instance__[prop].value = JSONdata[data];
                                        result++;
                                    }
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
                    __dependencies__: ["testclass"],
                    _states_: {
                        isActive: false,        // Флаг, сигнализирующий, активен ли объект
                        isSelected: false,      // Флаг, сигнализирующий, выбран ли объект
                        isChanged: false,       // Флаг, сигнализирующий, был ли изменен объект
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
                        }
                    }
                },


                /**
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
                }
            };

            return coreClasses;
        }]);
    })
    .run(function () {

    });



function Factory(parameters) {
    var result = undefined;

    /**
     * Если при вызове фабрики были заданы параметры инициализации
     */
    if (parameters !== undefined) {
        /**
         * Если в параметрах инициализации задан объект-приемник, то добавляем желаемые свойства и методы к нему,
         * в противном случае - создаем новый объект и добавляем желаемые свойства и методы к новому объекту
         */
        result = parameters["destination"] !== undefined ? parameters["destination"] : {};

        /**
         * Если в параметрах инициализации задан базовый класс, то устанавливаем у объекта свойство class
         */
        if (parameters["base_class"] !== undefined) {
           if ($systemClasses.classes.hasOwnProperty([parameters["base_class"]]))
                result.__class__ = parameters["base_class"];
        }

        console.log("destination object: ", result);

        /**
         * Если в параметрах инициализации указан массив с перечислением классов, свойства и методы которых требуется
         * унаследовать - производим установку свойств и методов этих классов к результирующему объекту
         */
        if (parameters["classes"] !== undefined && parameters["classes"].constructor === Array) {
            var classes = parameters["classes"];

            /* Обходим все базовые классы из массива наследуемых классов */
            for (var parent_class in classes) {
                console.log("parent class = ", classes[parent_class]);

                /* Если запрашиваемый класс существует в __classes__ */
                if (__classes__.hasOwnProperty(classes[parent_class])) {

                    /* Если текущий класс имеет зависимости от других классов */
                    if (__classes__[classes[parent_class]].hasOwnProperty("__dependencies__") &&
                        __classes__[classes[parent_class]].__dependencies__.length > 0) {
                        //TODO: add dependencies injection
                        console.log(classes[parent_class] + " have dependencies");
                    } else
                        console.log(classes[parent_class] + " have no dependencies");

                    /* Обходим все члены базового класса */
                    for (var member in __classes__[classes[parent_class]]) {
                        //console.log("member = ", __classes__[base_classes[parent_class]][member]);
                        //console.log("member = ", member);

                        /* Если текущим членом базового класса является функция */
                        if (__classes__[classes[parent_class]][member] !== undefined &&
                            __classes__[classes[parent_class]][member].constructor === Function) {

                            /* Если у объекта-приемника доступно свойство prototype */
                            if (result.prototype !== undefined) {
                                /**
                                 * Если родителем объекта-приемника не является Object,
                                 * тогда устанавливаем метод для всех наследников объекта
                                 * Если родителем объекта-приемника является Object,
                                 * тогда устанавливаем метод только для экземпляра объекта
                                 */
                                if (result.prototype.constructor !== Object)
                                    result.prototype[member] = __classes__[parent_class][member];
                                else
                                    result[member] = __classes__[parent_class][member];

                            } else if (result.__proto__ !== undefined) {
                                /**
                                 * Если родителем объекта-приемника не является Object,
                                 * тогда устанавливаем метод для всех наследников объекта
                                 * Если родителем объекта-приемника является Object,
                                 * тогда устанавливаем метод только для экземпляра объекта
                                 */
                                if (result.__proto__.constructor !== Object)
                                    result.__proto__[member] = __classes__[classes[parent_class]][member];
                                else
                                    result[member] = __classes__[classes[parent_class]][member];
                            }
                            /* Если текущим членом базового класса является свойство */
                        } else if ( __classes__[classes[parent_class]][member] !== undefined &&
                            __classes__[classes[parent_class]][member].constructor !== Function) {
                            if (member !== "__dependencies__") {
                                result[member] = __classes__[classes[parent_class]][member];
                                if (result[member]["__instance__"] !== undefined)
                                    result[member]["__instance__"] = result;
                            }
                        }

                    }
                } else {
                    console.log("there are no such class '" + classes[parent_class] + "' in __classes__");
                }
            }
        }
    }
    console.log("destination object: ", result);

    return result;
};




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




/**
 * Коллекция элементов
 * @constructor
 */
function Collection () {
    this.items = [];


    /**
     * Возвращает количество элементов в коллекции
     * @returns {Number} - Возвращает размер коллекции
     */
    Collection.prototype.size = function () {
        var result = 0;
        result = this.items.length;
        return result;
    };


    /**
     * Выводит в консоль все элементы коллекции
     * @returns {Number} - Возвращает количество элементов в коллекции
     */
    Collection.prototype.display = function () {
        var result = this.items.length;
        if (console !== undefined) {
            console.log(this.items);
        }
        return result;
    };


    /**
     * Возвращает элемент коллекции, поле field которого равен value
     * @param field {String} - Наименование поля
     * @param value - Значение искомого поля
     * @returns {boolean/Any} - Возвращает искомый элемент коллекции, в противном случае false
     */
    Collection.prototype.find = function (field, value) {
        var result = false;
        var length = this.items.length;

        /* Если требуется найти элемент коллекции по значению поля */
        if (field !== undefined && value !== undefined) {
            console.log("finding item by field and value");
            for (var i = 0; i < length; i++) {
                /* Если элемент коллекции является экземпляром класса Model */
                if (this.items[i].constructor === Model) {
                    if (this.items[i][field] !== undefined && this.items[i][field] === Field) {
                        if (this.items[i][field].value === value) {
                            result = this.items[i];
                        }
                    }
                /* Если элемент коллекции является объектом */
                } else {
                    if (this.items[i][field] !== undefined) {
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
    };


    /**
     * Добавляет элемент в конец коллекции
     * @param item {Any} - Элемент, добавляемый в коллекцию
     * @returns {boolean / Number} - Возвращает новую длину коллекции, false в случае некорректного завершения
     */
    Collection.prototype.append = function (item) {
        var result = false;
        if (item !== undefined) {
            result = this.items.push(item);
        }
        return result;
    };


    /**
     * Удаляет элементы по значению поля и по значению
     * @param field {String} - Наименование поля
     * @param value {Any} - Значение поля
     * @returns {Number} - Возвращает количество удаленных элементов
     */
    Collection.prototype.delete = function (field, value) {
        var result = 0;
        var length = this.items.length;

        /* Если требуется удалить элементы коллекции по полю и его значению */
        if (field !== undefined && value !== undefined) {
            console.log("deleting by field and value");
            for (var i = 0; i < length; i++) {
                /* Если элемент коллекции является экземпляром класса Model */
                if (this.items[i].constructor === Model) {
                    if (this.items[i][field] !== undefined && this.items[i][field].constructor === Field) {
                        if (this.items[i][field].value === value) {
                            this.items.splice(i, 1);
                            result++;
                        }
                    }
                /* Если элемент коллекции является объектом */
                } else {
                    if (this.items[i][field] !== undefined) {
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
    };
};
