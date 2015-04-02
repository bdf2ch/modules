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
    "initiator": {
        init: function (parameters) {

        }
    },
    "states": {
        dependencies: {
            properties: [
                "testdep"
            ]
        },
        active: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean) {
                this.isActive = flag;
            }
        },
        select: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean) {
                this.isSelected = flag;
            }
        }
    }
};

function TestObj () {
    this.properties = [
        "states",
        "contacts"
    ];
    this.prototypes = [
        "initiator"
    ];

    this.onCreate = this.prototypes["initiator"]["init"];
};


/**
 * Устанавливает у объекта выбранную группу свойств
 * @param propname - имя группы свойств
 * @param destination - объект-приемник свойств
 */
function setProperties (propname, destination) {
    if (propname !== undefined && destination !== undefined) {
        if (properties.hasOwnProperty(propname)) {
            for (var prop in properties[propname]) {
                destination[prop] = properties[propname][prop];
            }
        }
    }
};


function setPrototypes (protname, destination) {
    if (protname !== undefined && destination !== undefined) {
        if (prototypes.hasOwnProperty(protname)) {
            if (prototypes[protname].hasOwnProperty("dependencies")) {
                for (var dep in prototypes[protname]["dependencies"]) {
                    if (prototypes.hasOwnProperty(prototypes[]))
                }
            }
        }
    }
};


/**
 * Фабрика объектов
 * @param props - массив групп свойств объекта
 * @param protos - массив групп методов объекта
 * @returns {{}}
 */
function Factory (props, protos) {
    var result = {};

    if (props !== undefined) {
        for (var prop in props) {
            setProperties(props[prop], result);
        }
    }

    if (protos !== undefined) {
        for (var proto in protos) {
            console.log(protos[proto]);
            if (prototypes.hasOwnProperty(protos[proto])) {
                console.log(protos[proto] + " found");
                /*
                if (prototypes[protos[proto]].hasOwnProperty("dependencies")) {
                    console.log(protos[proto] + " have dependencies");
                    for (var dep in prototypes[protos[proto]]["dependencies"]) {
                        if (prototypes.hasOwnProperty(protos[proto]["dependencies"][dep])) {
                            for (var prop_item in properties[props[prop]]) {
                                result[prop_item] = properties[props[prop]][prop_item];
                            }
                        }
                    }

                }
                */
                for (var proto_item in prototypes[protos[proto]]) {
                    if (result.prototype !== undefined)
                        result.prototype[proto_item] = prototypes[protos[proto]][proto_item];
                    else
                        result.__proto__[proto_item] = prototypes[protos[proto]][proto_item];
                    console.log("method '" + proto_item + "' attached to object");
                }
            }
        }
    }

    return result;
};

