"use strict";


/**
 * Модуль gears.classes
 * Определяет сервис $gearsClasses, содержащий описание классов, используемых в административной панели
 */
var gearsClasses = angular.module("gears.classes", [])
    .config(function ($provide) {
        $provide.factory("$gearsClasses", [function () {
            var gearsClasses = {};

            gearsClasses.classes = {

                /**
                 * File
                 * Набор свойст, описывающих файл
                 */
                File: {
                    id: 0,              // Идентификатор файла
                    title: "",          // Наименование файла
                    size: 0,            // Размер файла
                    extension: ""       // Расширение файла
                },

                /**
                 * User
                 * Набор свойств, описывающих пользователя
                 */
                User: {
                    id: new Field({ source: "user_id", value: 0 }),
                    name: new Field({ source: "user_name", value: "", required: true, backupable: true }),
                    fname: new Field({ source: "user_fname", value: "", required: true, backupable: true }),
                    surname: new Field({ source: "user_surname", value: "", required: true, backupable: true }),
                    email: new Field({ source: "user_email", value: "", required: true, backupable: true }),
                    phone: new Field({ source: "user_phone", value: "", backupable: true })
                }

            };

            return gearsClasses;
        }]);
    })
    .run(function () {

    });