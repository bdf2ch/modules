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
var auth = angular.module("core.auth", ["ngCookies", "core"])
    .config(function ($provide) {
        $provide.constant("controller", "test");


        /**
         * $session
         * Сервис сессии текущего пользователя
         */
        $provide.factory("$session", ["$log", "$cookies", "$factory", function ($log, $cookies, $factory) {
            var session = {};

            session.classes = {

                /**
                 * CurrentUser
                 * Набор свойсв, описывающих текущего пользователя
                 */
                CurrentUser: {
                    id: new Field({ source: "user_id", value: 0 }),
                    name: new Field({ source: "user_name", value: "" }),
                    fname: new Field({ source: "user_fname", value: "" }),
                    surname: new Field({ source: "user_surname", value: "" }),
                    email: new Field({ source: "user_email", value: "" }),
                    phone: new Field({ source: "user_phone", value: "" })
                }
            };

            session.user = undefined;               // Пользователь
            session.id = undefined;                 // Идентификатор сессии
            session.startedAt = 0;                  // Время начала сессии в формате Unix


            /* Сохранение данных пользователя в cookie */
            session.toCookie = function () {
                $cookies._user_ = session.user._model_.toString();
                return true;
            };


            /* Извлечение данных пользователя из cookie */
            session.fromCookie = function () {
                var result = false;
                if ($cookies._user_ !== undefined) {
                    session.user.fromJSON(JSON.parse($cookies.user));
                    result = true;
                }
                return result;
            };

            /**
             * Инициализирует сервис
             */
            session.init = function () {
                session.user = $factory.make({ classes: ["CurrentUser", "Model"], base_class: "CurrentUser" });
                session.fromCookie();
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
            auth.inRemindPasswordMode = false;       // Флаг, сигнализирующий, что активирован режим напоминания пароля
            auth.errors = {
                username: [],                       // Массив ошибок имени пользователя
                password: []                        // Массив ошибок пароля пользователя
            };


            /**
             * Валидация имени пользователя и пароля
             */
            auth.validate = function () {
                /* Сброс флагов состояний */
                auth.isAuthSuccessed = false;
                auth.isAuthFailed = false;

                /* Очистка массивов с ошибками */
                auth.errors.username.splice(0, auth.errors.username.length);
                auth.errors.password.splice(0, auth.errors.password.length);

                if (auth.inRemindPasswordMode === true) {
                    /* Проверка корректности ввода имени пользователя */
                    if (auth.username === "")
                        auth.errors.username.push("Вы не указали имя пользователя");
                } else {
                    /* Проверка корректности ввода имени пользователя */
                    if (auth.username === "")
                        auth.errors.username.push("Вы не указали имя пользователя");

                    /* Проверка корректности ввода пароля */
                    if (auth.password === "")
                        auth.errors.password.push("Вы не указали пароль");
                }

                /* Если ошибок нет, то отправляем данные на сервер */
                if (auth.errors.username.length === 0 && auth.errors.password.length === 0 )
                    auth.send();
            };


            /**
             * Отправляет имя пользователя и пароль на сервер
             */
            auth.send = function () {
                var act = auth.inRemindPasswordMode === true ? "remindPassword" : "logIn";
                var params = {
                    action: act,
                    data: {
                        username: auth.username,
                        password: auth.password
                    }
                };
                auth.sendingInProgress = true;
                $http.post("../serverside/controllers/authorization.php", params)
                    .success(function (data) {
                        if (data !== undefined) {
                            $log.log(data);

                            if (parseInt(data) !== -1) {
                                $session.user._model_.fromJSON(data);
                                $session.toCookie();
                                auth.isAuthSuccessed = true;
                            } else {
                                auth.errors.username.push("Пользователь не найден");
                                auth.isAuthFailed = true;
                            }

                        }
                        auth.sendingInProgress = false;
                    })
            };


            auth.remindPasswordMode = function () {
                auth.errors.username.splice(0, auth.errors.username.length);
                auth.errors.password.splice(0, auth.errors.password.length);
                auth.inRemindPasswordMode = !auth.inRemindPasswordMode;
                return auth.inRemindPasswordMode;
            };

            return auth;
        }]);

    }
)
    .run(function ($modules, $rootScope, $authorization, $session, $factory) {
        $modules.load($authorization);
        $modules.load($session);
        $session.init();
        $rootScope.authorization = $authorization;
    });



/**
 * Контроллер формы авторизации пользователя
 */
auth.controller("AuthorizationController", ["$log", "$scope", "$authorization", function ($log, $scope, $authorization) {
    $scope.auth = $authorization;
}]);
