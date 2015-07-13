"use strict";


var  gears = angular.module("gears.application", [])
    .config(function ($provide) {

        /**
         * $gears
         * Сервис административной панели
         */
        $provide.factory("$gears", [function () {
            var application = {};

            application.title = "Gears test application";

            return application;
        }]);
    })
    .run(function ($log, $rootScope, $gears) {
        $rootScope.gears = $gears;
        $log.log("Welcome to gears");
    });
