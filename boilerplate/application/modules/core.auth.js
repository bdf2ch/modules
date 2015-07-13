"use strict";


/**
 *
 * @constructor
 */
function CurrentUser () {
    this.id = new Field ({ source: "user_id", value: 0 });
    this.name = new Field ({ source: "user_name", value: "" });
    this.fname = new Field ({ source: "user_fname", value: "" });
    this.surname = new Field ({ source: "user_surname", value: "" });
    this.email = new Field ({ source: "user_email", value: "" });
    this.phone = new Field ({ source: "user_phone", value: "" });
};


/**
 * system.auth
 * Модуль авторизации
 */
var auth = angular.module("system.auth", ["ngCookies"])
    .config(function ($provide) {
        $provide.constant("controller", "test");


        /**
         * $session
         * Сервис сессии текущего пользователя
         */
        $provide.factory("$session", ["$log", "$cookies", function ($log, $cookies) {
            var session = {};

            session.user = undefined;               // Пользователь
            session.id = undefined;                 // Идентификатор сессии
            session.startedAt = 0;                  // Время начала сессии в формате Unix


            /* Сохранение данных пользователя в cookie */
            session.toCookie = function () {
                $cookies.user = session.user.toString();
                return true;
            };


            /* Извлечение данных пользователя из cookie */
            session.fromCookie = function () {
                var result = false;
                if ($cookies.user !== undefined) {
                    session.user.fromJSON(JSON.parse($cookies.user));
                    result = true;
                }
                return result;
            };

            return session;
        }]);


        /**
         * $authorization
         * Сервис авторизации
         */
        $provide.factory("$authorization", ["$log", "$http", "$session", function ($log, $http, $session) {
            var auth = {};

            auth.username = "";                     // Имя пользователя
            auth.password = "";                     // Пароль пользователя
            auth.sendingInProgress = false;         // Флаг, сигнализирующий, что выполняется отправка данных на сервер
            auth.isAuthSuccessed = false;           // Флаг, сигнализирующий, что авторизация завершилась успешно
            auth.isAuthFailed = false;              // Флаг, сигнализирующий, что авторизация завершилась ошибкой
            auth.errors = {
                username: [],                       // Массив ошибок имени пользователя
                password: []                        // Массив ошибок пароля пользователя
            };


            /**
             * Валидация имени пользователя и пароля
             */
            auth.logIn = function () {
                /* Сброс флагов состояний */
                auth.isAuthSuccessed = false;
                auth.isAuthFailed = false;

                /* Очистка массивов с ошибками */
                auth.errors.username.splice(0, auth.errors.username.length);
                auth.errors.password.splice(0, auth.errors.password.length);

                /* Проверка корректности ввода имени пользователя */
                if (auth.username === "")
                    auth.errors.username.push("Вы не указали Ваш логин");

                /* Проверка корректности ввода пароля */
                if (auth.password === "")
                    auth.errors.password.push("Вы не указали Ваш пароль");

                /* Если ошибок нет, то отправляем данные на сервер */
                if (auth.errors.username.length === 0 && auth.errors.password.length === 0 )
                    auth.send();
            };


            /**
             * Отправляет имя пользователя и пароль на сервер
             */
            auth.send = function () {
                var params = {
                    action: "logIn",
                    data: {
                        username: auth.username,
                        password: auth.password
                    }
                };
                auth.sendingInProgress = true;
                $http.post("", params)
                    .success(function (data) {
                        if (data !== undefined) {
                            if (parseInt(data) !== 0) {
                                var current_user = new CurrentUser();
                                current_user.fromJSON(data);
                                $session.user = current_user;
                                auth.isAuthSuccessed = true;
                            } else {
                                auth.isAuthFailed = true;
                            }
                        }
                        auth.sendingInProgress = false;
                    })
            };

            return auth;
        }]);

    }
);



/**
 * Контроллер формы авторизации пользователя
 */
auth.controller("AuthorizationController", ["$log", "$scope", "$authorization", function ($log, $scope, $authorization) {
    $scope.auth = $authorization;
}]);
