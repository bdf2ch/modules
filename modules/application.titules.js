"use strict";


var titules = angular.module("application.titules",[])
    .config(function ($provide) {

        /**
         * $titules
         * Сервис, одержащий функционал для работы с титулами
         */
        $provide.factory("$titules", ["$log", "$http", "$factory", function ($log, $http, $factory) {
            var titules = {};


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
                }
            };


            titules.query = function () {
                $http.post("serverside/controllers/titules.php", {action: "query"})
                    .success(function (data) {
                        if (data !== undefined) {
                            angular.forEach(data, function (titule_data) {
                                var titule = $factory.make({ classes: ["Titule", "Model", "Backup", "States"], base_class: "Titule" });
                                titule._model_.fromJSON(titule_data);
                                titule._backup_.setup();
                            });
                        }
                    }
                );
            };


            titules.add = function () {

            };

            return titules;
        }]);
    })
    .run(function ($modules, $titules) {
        $modules.load($titules);
        $titules.query();
    });