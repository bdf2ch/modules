/*****
 * Структуры и типы данных
 *****/
"use strict";

var properties = {
    states: {
        isActive: false,
        isSelected: false,
        isDeleted: false
    },
    contacts: {
        phone: "",
        email: ""
    },
    testdep: {
        test1: 1,
        test2: 2
    }
};

var prototypes = {
    initiator: {
        init: function (parameters) {
            console.log("initiator.init called");
        }
    },
    states: {
        dependencies: ["states"],

        /**
         * Помечает объект как активный
         * @param {Boolean} flag Логическое значение вкл./выкл.
         */
        active: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean) {
                this.isActive = flag;
            }
        },

        /**
         * Помечает объект как выбранный
         * @param {Boolean} flag Логическое значение вкл./выкл.
         */
        select: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean) {
                this.isSelected = flag;
            }
        }
    },
    test: {
        testfunc: function () {}
    }
};





/**
 * Устанавливает у объекта выбранную группу свойств
 *
 * @param {String} propname - имя группы свойств
 * @param {Object} destination - объект-приемник свойств
 */
function setProperties (propname, destination) {
    if (propname !== undefined && destination !== undefined) {
        if (properties.hasOwnProperty(propname)) {
            destination[propname] = properties[propname];
        }
    }
};





/**
 * Устанавливает у объекта выбранную группу методов
 *
 * @param {String} protname - имя группы методов
 * @param {Object} destination - объект-приемник методов
 */
function setPrototypes (protname, destination) {
    if (protname !== undefined && destination !== undefined) {
        if (prototypes.hasOwnProperty(protname)) {
            if (prototypes[protname].hasOwnProperty("dependencies")) {
                for (var prop in prototypes[protname]["dependencies"])
                    setProperties(prototypes[protname]["dependencies"][prop], destination);
            }

            for (var proto in prototypes[protname]) {
                if (proto !== "dependencies") {
                    /*** Если у объекта-приемника доступно свойство prototype ***/
                    if (destination.prototype !== undefined) {
                        /**
                         * Если родителем объекта-приемника не является Object,
                         * тогда устанавливаем метод для всех наследников объекта
                         */
                        if (destination.prototype.constructor !== Object)
                            destination.prototype[proto] = prototypes[protname][proto];
                        /**
                         * Если родителем объекта-приемника является Object,
                         * тогда устанавливаем метод только для экземпляра объекта
                         */
                        else
                            destination[proto] = prototypes[protname][proto];
                        /*** Если у объекта-приемника доступно свойство __proto__ ***/
                    } else if (destination.__proto__ !== undefined) {
                        /**
                         * Если родителем объекта-приемника не является Object,
                         * тогда устанавливаем метод для всех наследников объекта
                         */
                        if (destination.__proto__.constructor !== Object)
                            destination.__proto__[proto] = prototypes[protname][proto];
                        /**
                         * Если родителем объекта-приемника является Object,
                         * тогда устанавливаем метод только для экземпляра объекта
                         */
                        else
                            destination[proto] = prototypes[protname][proto];
                    }
                }
            }
        }
    }
};





/**
 * Фабрика объектов
 *
 * @param props {Array} Массив групп свойств объекта
 * @param protos {Array} Массив групп методов объекта
 * @returns {{}} Новый объект с заданными группами свойств и методами
 */
function Factory (props, protos, destination) {

    /**
     * Если указан объект-приемник destination, то добавляем свойства
     * и методов к нему, иначе создаем и конструируем новый объект
     */
    var result = destination !== undefined ? destination : {};

    /**
     *  Установка групп свойств конструируемому объекту,
     *  группы свойств указаны в массиве props
     */
    if (props !== undefined) {
        for (var prop in props) {
            setProperties(props[prop], result);
        }
    }

    /**
     *  Установка Групп методов конструироемому объекту .
     *  группы методов укзаны в массиве protos
     */
    if (protos !== undefined) {
        for (var proto in protos) {
            setPrototypes(protos[proto], result);
        }
    }

    /**
     * Возвращаем сконструированные объект
     */
    return result;
};

