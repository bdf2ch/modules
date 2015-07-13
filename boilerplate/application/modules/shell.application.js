"use strict";


var shell = angular.module("shell.application", [
        "ngRoute",          // Подключаем модуль управления рутами
        "core.classes",     // Подключаем модуль с системными классами
        "shell.classes"     // Подключаем модуль с классами приложения
    ])
    .config(function ($provide) {

        /**
         * $application
         * Сервис приложения
         */
        $provide.factory("$application", ["$factory", function ($factory) {
            var application = {};

            application.title = "Test application";
            application.description = "This is a test application provided by Shell Framework";

            var f = new $factory.make({ classes: ["Flower", "Model", "Backup"], base_class: "Flower" });
            var json = {
                flower_id: 158,
                flower_title: "test flower title",
                flower_description: "test flower description"
            };
            f._backup_.setup();
            f._model_.fromJSON(json);
            console.log(f);

            return application;
        }]);
    })
    .run(function ($log, $application, $rootScope) {
        $rootScope.application = $application;
        $log.log("Welcome to " + $application.title);
        $log.log($application.description);
    });