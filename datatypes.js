/*****
 * ��������� � ���� ������
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
         * �������� ������ ��� ��������
         * @param {Boolean} flag ���������� �������� ���./����.
         */
        active: function (flag) {
            if (flag !== undefined && flag.constructor === Boolean) {
                this.isActive = flag;
            }
        },

        /**
         * �������� ������ ��� ���������
         * @param {Boolean} flag ���������� �������� ���./����.
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
 * ������������� � ������� ��������� ������ �������
 *
 * @param {String} propname - ��� ������ �������
 * @param {Object} destination - ������-�������� �������
 */
function setProperties (propname, destination) {
    if (propname !== undefined && destination !== undefined) {
        if (properties.hasOwnProperty(propname)) {
            destination[propname] = properties[propname];
        }
    }
};





/**
 * ������������� � ������� ��������� ������ �������
 *
 * @param {String} protname - ��� ������ �������
 * @param {Object} destination - ������-�������� �������
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
                    /*** ���� � �������-��������� �������� �������� prototype ***/
                    if (destination.prototype !== undefined) {
                        /**
                         * ���� ��������� �������-��������� �� �������� Object,
                         * ����� ������������� ����� ��� ���� ����������� �������
                         */
                        if (destination.prototype.constructor !== Object)
                            destination.prototype[proto] = prototypes[protname][proto];
                        /**
                         * ���� ��������� �������-��������� �������� Object,
                         * ����� ������������� ����� ������ ��� ���������� �������
                         */
                        else
                            destination[proto] = prototypes[protname][proto];
                        /*** ���� � �������-��������� �������� �������� __proto__ ***/
                    } else if (destination.__proto__ !== undefined) {
                        /**
                         * ���� ��������� �������-��������� �� �������� Object,
                         * ����� ������������� ����� ��� ���� ����������� �������
                         */
                        if (destination.__proto__.constructor !== Object)
                            destination.__proto__[proto] = prototypes[protname][proto];
                        /**
                         * ���� ��������� �������-��������� �������� Object,
                         * ����� ������������� ����� ������ ��� ���������� �������
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
 * ������� ��������
 *
 * @param props {Array} ������ ����� ������� �������
 * @param protos {Array} ������ ����� ������� �������
 * @returns {{}} ����� ������ � ��������� �������� ������� � ��������
 */
function Factory (props, protos, destination) {

    /**
     * ���� ������ ������-�������� destination, �� ��������� ��������
     * � ������� � ����, ����� ������� � ������������ ����� ������
     */
    var result = destination !== undefined ? destination : {};

    /**
     *  ��������� ����� ������� ��������������� �������,
     *  ������ ������� ������� � ������� props
     */
    if (props !== undefined) {
        for (var prop in props) {
            setProperties(props[prop], result);
        }
    }

    /**
     *  ��������� ����� ������� ��������������� ������� .
     *  ������ ������� ������ � ������� protos
     */
    if (protos !== undefined) {
        for (var proto in protos) {
            setPrototypes(protos[proto], result);
        }
    }

    /**
     * ���������� ����������������� ������
     */
    return result;
};

