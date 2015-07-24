"use strict";


var gearsFlowers = angular.module("gears.flowers", [])
    .config(function ($provide) {
        $provide.factory("$gflowers", ["$log", "$http", "$flowers", function ($log, $http, $flowers) {
            var gflowers = {};

            gflowers.addFlower = function (flower) {
                if (flower !== undefined && flower.__class__ !== undefined && flower.__class__ === "Flower") {

                }
            };

            return gflowers;
        }]);
    })
    .run(function () {

    }
);