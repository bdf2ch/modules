"use strict";



/**
 * system.auth
 * Модуль авторизации
 */
var grAuth = angular.module("gears.auth", ["ngCookies", "ngRoute", "gears"])
    .config(function ($provide) {


        /**
         * $session
         * Сервис сессии текущего пользователя
         */
        $provide.factory("$session", ["$log", "$cookies", "$factory", function ($log, $cookies, $factory) {
            var session = {};

            session.classes = {

                /**
                 * CurrentUser
                 * Набор свойсв, описывающих текущего пользователя приложения
                 */
                CurrentUser: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    name: new Field({ source: "name", value: "", default_value: "" }),
                    fname: new Field({ source: "fname", value: "", default_value: "" }),
                    surname: new Field({ source: "surname", value: "", default_value: "" }),
                    email: new Field({ source: "email", value: "", default_value: "" }),
                    phone: new Field({ source: "phone", value: "", default_value: "" })
                }
            };

            /**
             * Приватные переменные сервиса
             */
            var user = undefined;               // Пользователь
            var id = undefined;                 // Идентификатор сессии
            var startedAt = 0;                  // Время начала сессии в формате Unix
            var isLoggedIn = false;


            /**
             * Возвращает текущего пользователя приложения
             * @returns {CurrentUser / undefined} - Возвращает текущего пользователя приложения если он установлен,
             *                                      в противном случае - undefined
             */
            session.getUser = function () {
                return user;
            };


            /**
             * Устанавливает пользователя текущей сессии
             * @param newUser {CurrentUser} - Объект, описывающий текущего пользователя приложения
             * @returns {CurrentUser / boolean} - Возвращает текущего пользователя в случае успеха, иначе - false
             */
            session.setUser = function (newUser) {
                var result = false;
                if (newUser !== undefined) {
                    if (newUser.__class__ !== undefined) {
                        if (newUser.__class__ === "CurrentUser") {
                            user = newUser;
                            $cookies.appUser = user._model_.toString();
                            isLoggedIn = true;
                            result = user;
                        }
                    }
                }
                return result;
            };


            /**
             * Возвращает флаг, авторизован ли пользователь в приложении
             * @returns {boolean} - Возвращает флаг, авторизован ли пользователь в приложении
             */
            session.loggedIn = function () {
                return isLoggedIn;
            };


            /**
             * Инициализирует сервис
             */
            session.init = function () {
                //$cookies.appUser = JSON.stringify("test");

                user = $factory({ classes: ["CurrentUser", "Model", "Backup", "States"], base_class: "CurrentUser" });
                startedAt = new moment().unix();
                if ($cookies.appUser !== undefined) {
                    $log.log("appUser cookie json = ", JSON.parse($cookies.appUser));
                    user._model_.fromAnother(JSON.parse($cookies.appUser));
                    isLoggedIn = true;
                } else {
                    $log.log("there are no appUser cookie");
                }
                $log.log("session started at = ", startedAt);
                $log.log("user is logged in = ", session.loggedIn());
                $log.log("currentUser = ", user);
            };

            return session;
        }]);


        /**
         * $authorization
         * Сервис авторизации
         */
        $provide.factory("$authorization", ["$log", "$http", "$session", "$factory", function ($log, $http, $session, $factory) {
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
            auth.logIn = function (callback) {
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
                    auth.send(callback);
            };

            auth.reset = function () {
                auth.username = "";
                auth.password = "";
                auth.errors.username.splice(0, auth.errors.username.length);
                auth.errors.password.splice(0, auth.errors.password.length);
            };


            /**
             * Отправляет имя пользователя и пароль на сервер
             */
            auth.send = function (callback) {
                var act = auth.inRemindPasswordMode === true ? "remindPassword" : "logIn";
                var params = {
                    action: act,
                    data: {
                        username: auth.username,
                        password: auth.password
                    }
                };
                auth.sendingInProgress = true;
                $http.post("serverside/controllers/authorization.php", params)
                    .success(function (data) {
                        if (data !== undefined) {
                            $log.log(data);

                            if (data["error_code"] === undefined) {
                                if (parseInt(data) === -1) {
                                    auth.errors.username.push("Пользователь не найден");
                                    auth.isAuthFailed = true;
                                } else {
                                    if (data["user"] !== undefined) {
                                        var temp_user = $factory({ classes: ["CurrentUser", "Model", "Backup", "States"], base_class: "CurrentUser" });
                                        temp_user._model_.fromJSON(data["user"]);
                                        temp_user._backup_.setup();
                                        $session.setUser(temp_user);
                                        auth.isAuthSuccessed = true;
                                    }
                                    if (data["data"] !== undefined) {
                                        callback(data);
                                    }
                                }
                            } else {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
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
    .run(function ($modules, $rootScope, $authorization, $session) {
        $modules.load($authorization);
        $modules.load($session);
        $session.init();
        $rootScope.authorization = $authorization;
        $rootScope.session = $session;
    });



/**
 * Контроллер формы авторизации пользователя
 */
grAuth.controller("AuthorizationController", ["$log", "$scope", "$authorization", function ($log, $scope, $authorization) {
    $scope.auth = $authorization;
}]);
