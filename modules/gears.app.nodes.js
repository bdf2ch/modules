"use strict";


var nodes = angular.module("application.nodes", [])
    .config(function ($provide) {

        /**
         * $nodes
         * ������, ���������� ���������� ��� ������ � ������
         */
        $provide.factory("$nodes", ["$log", "$factory", "$menu", function ($log, $factory, $menu) {
            var nodes = {};


            /**
             * ������ ������ � �������, ����������� ������ ������
             */
            nodes.classes = {
                /**
                 * NodeType
                 * ����� �������, ����������� ��� ����
                 */
                NodeType: {
                    id: new Field({ source: "ID", value: 0 }),
                    title: new Field({ source: "TITLE", value: "" }),
                    isBasicObject: new Field({ source: "IS_BASE_OBJECT", value: 0 })
                },

                /**
                 * UnknownNode
                 * ����� ������, ����������� ����������������� ����
                 */
                UnknownNode: {
                    id: new Field({ source: "NODE_ID", value: 0, default_value: 0 }),
                    pointId: new Field({ source: "POINT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    tituleId: new Field({ source: "TITULE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    titulePartId: new Field({ source: "TITULE_PART_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    branchesCount: new Field({ source: "OUT_PATHS", value: 0, default_value: 0 })
                },

                /**
                 * Pylon
                 * ����� ������, ����������� �����
                 */
                Pylon: {
                    id: new Field({ source: "NODE_ID", value: 0, default_value: 0 }),
                    nodeTypeId: new Field({ source: "OBJECT_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    pointId: new Field({ source: "POINT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    pylonTypeId: new Field({ source: "PYLON_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    pylonSchemeTypeId: new Field({ source: "PYLON_SCHEME_TYPE_ID", value: 0, default_value: 0, backupable: true }),
                    powerLineId: new Field({ source: "POWER_LINE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    number: new Field({ source: "PYLON_NUMBER", value: 0, default_value: 0, backupable: true, required: true }),
                    branchesCount: new Field({ source: "OUT_PATHS", value: 0, default_value: 0 })
                },

                /**
                 * PowerStation
                 * ����� �������, ����������� ��������������
                 */
                PowerStation: {
                    id: new Field({ source: "OBJECT_ID", value: 0, default_value: 0 }),
                    title: new Field({ source: "TITLE", value: "", default_value: "", backupable: true, required: true }),
                    voltage: new Field({ source: "VOLTAGE", value: 0, default_value: 0, backupable: true, required: true })
                }
            };


            /**
             * �������� ������� ����
             */
            nodes.menu = $menu.set({
                id: 1,
                title: "Nodes Menu Item"
            });

            return nodes;
        }]);
    })
    .run(function ($modules, $nodes) {
        $modules.load($nodes);
    }
);