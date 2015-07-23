"use strict";


var titules = angular.module("application.titules",[])
    .config(function ($provide) {

        /**
         * $titules
         * Сервис, одержащий функционал для работы с титулами
         */
        $provide.factory("$titules", ["$log", "$http", "$factory", "$f", function ($log, $http, $factory, $f) {
            var titules = {};


            /**
             * Наборы свойст и методов, описывающих модели данных
             */
            titules.classes = {
                /**
                 * Titule
                 * Набор свойств, описывающих титул
                 */
                Titule: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    title: new Field({ source: "TITUL_NAME", value: "", default_value: "", backupable: true, required: true }),
                    startPointId: new Field({ source: "START_POINT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    startObjectTypeId: new Field({ source: "START_OBJECT_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    startObjectId: new Field({ source: "START_OBJECT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    endPointId: new Field({ source: "END_POINT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    endObjectTypeId: new Field({ source: "END_OBJECT_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    endObjectId: new Field({ source: "END_OBJECT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    description: new Field({ source: "NAME_EXTRA", value: "", default_value: "", backupable: true }),
                    length: new Field({ source: "LENGTH", value: 0, default_value: 0, backupable: true })
                 },

                /**
                 * TitulePart
                 * Набор свойст, описывающих участок титула
                 */
                TitulePart: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    tituleId: new Field({ source: "TITUL_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    title: new Field({ source: "TITLE", value: "", default_value: "", backupable: true, required: true }),
                    startPointId: new Field({ source: "START_POINT_ID", value: 0, default_value: 0, backupable: true }),
                    startObjectTypeId: new Field({ source: "START_OBJECT_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    startObjectId: new Field({ source: "START_OBJECT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    endPointId: new Field({ source: "END_POINT_ID", value: 0, default_value: 0, backupable: true }),
                    endObjectTypeId: new Field({ source: "END_OBJECT_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    endObjectId: new Field({ source: "END_OBJECT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    length: new Field({ source: "LENGTH", value: 0, default_value: 0, backupable: true })
                },

                /**
                 * TituleNodes
                 * Набор свойст и методов, описывающих иерархию узлов, входящих в титул
                 */
                TituleNodes: {
                    nodes: [],
                    path: {
                        __instance__: "",
                        nodes: [],

                        append: function (node) {
                            if (node !== undefined) {
                                if (this.__instance__.path.nodes.length > 0) {
                                    node.previousNodeId = this.__instance__.path.nodes[this.__instance__.path.nodes.length - 1].id.value;
                                    this.__instance__.path.nodes[this.__instance__.path.nodes.length - 1].nextNodeId = node.id.value;
                                } else
                                    node.previousNodeId = -1;

                                node.nextNodeId = -1;
                                node.haveBranches = node.branchesCount.value > 0 ? true : false;
                                node.collapsed = true;

                                this.__instance__.path.nodes.push(node);
                                this.__instance__.nodes.push(node);
                            }
                        }
                    },

                    /**
                     * Возвращает узел с заданным идентификатором
                     * @param nodeId {number} - Идентификатор узла
                     * @returns {boolean / object} - Возвращает искомый узел, в противном случае - false
                     */
                    getNode: function (nodeId) {
                        var result = false;
                        if (nodeId !== undefined) {
                            var length = this.nodes.length;
                            for (var i = 0; i < length; i++) {
                                if (this.nodes[i].id.value === nodeId)
                                    result = this.nodes[i];
                            }
                        }
                        return result;
                    },

                    /**
                     * Возвращает массив ответвлений узла с заданныи идентификатором
                     * @param nodeId {number} - Идентификатор узла
                     * @returns {boolean / array} - Возвращает массив ответвлений узла, в противном случае - false
                     */
                    getBranches: function (nodeId) {
                        var result = false;
                        if (nodeId !== undefined) {
                            var length = this.nodes.length;
                            for (var i = 0; i < length; i++) {
                                if (this.nodes[i].branches !== undefined)
                                    result = this.nodes[i].branches;
                            }
                        }
                        return result;
                    }
                }


            };


            /**
             * Переменные сервиса
             */
            //titules.titules = $factory.make({ classes: ["Collection"], base_class: "Collection" });
            titules.titules = $f({ classes: ["Collection"], base_class: "Collection" });
            titules.parts = $factory.make({ classes: ["Collection"], base_class: "Collection" });


            /**
             * Получает список всех титулов и помещает их в коллекцию
             */
            titules.titulesQuery = function () {
                $http.post("serverside/controllers/titules.php", {action: "query"})
                    .success(function (data) {
                        if (data !== undefined) {
                            angular.forEach(data, function (titule_data, key) {
                                //var titule = $factory.make({ classes: ["Titule", "Model", "Backup", "States"], base_class: "Titule" });
                                //titule._model_.fromJSON(titule_data);
                                //titule._backup_.setup();
                                //titules.titules.append(titule);

                                var test = $f({ classes: ["Model", "Titule", "Backup"], base_class: "Titule" });
                                test._model_.fromJSON(titule_data);
                                titules.titules.append(test);
                                test._backup_.setup();
                                $log.log("f = ", test);
                            });
                        }
                        $log.log(titules.titules);
                    }
                );
            };


            /**
             * Получает список частей титулов всех титулов
             */
            titules.partsQuery = function () {
                $http.post("serverside/controllers/titule-parts.php", {action: "query"})
                    .succes(function (data) {
                        if (data !== undefined) {
                            angular.forEach(data, function (titule_part) {
                                var part = $factory.make({ classes: ["TitulePart", "Model", "Backup", "States"], base_class: "TitulePart" });
                                part._model_.fromJSON(titule_part);
                                part._backup_.setup();
                                titules.parts.append(part);
                            });
                        }
                    }
                );
            };


            /**
             * Отправляет данные нового титула на сервер и добавляет его в коллекцию
             * @param titule
             */
            titules.add = function (titule) {
                $http.post("")
                    .success(function (data) {
                        if (data !== undefined) {
                            var added_titule = $factory.make({ classes: ["Titule", "Model", "Backup", "States"], base_class: "Titule" });
                            added_titule._model_.fromJSON(data);
                            added_titule._backup_.setup();
                            titules.titules.append(added_titule);
                        }
                    }
                );
            };


            return titules;
        }]);
    })
    .run(function ($modules, $titules, $log) {
        $modules.load($titules);
        $titules.titulesQuery();
        //$log.log($titules.titules);
        //$titules.titules.display();
    });