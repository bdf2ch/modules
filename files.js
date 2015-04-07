angular.module("files", [])
    .config(function ($provide) {
        $provide.service("$files", ["$log", "$http", function ($log, $http) {
            return {

                /**
                 *
                 */
                controllerUrl: "",
                isLoading: false,


                
                /**
                 * Устанавливает состояние активности загрузки данных в модуле
                 * @param {Boolean} flag Флаг активности загрузки данных
                 * @returns {Boolean}
                 */
                loading: function (flag) {
                    if (flag !== undefined && flag.constructor === Boolean) {
                        this.isLoading = flag;
                        return flag;
                    }
                },



                /**
                 * Устанавливает url серверного контроллера для модуля
                 * @param {String} controllerUrl Url контроллера
                 */
                setController: function (controllerUrl) {
                    if (controllerUrl !== undefined) {
                        module.controllerUrl = controllerUrl;
                        return true;
                    } else
                        return false;
                },



                /**
                 * Отправляет информацию о добавляемом файле контроллеру
                 * @param {Object} params Параметры добавляемого файла
                 * @param {Function} callback Callback-функция
                 */
                add: function (params, callback) {
                    if (params !== undefined) {
                        var parameters ={
                            action: "add",
                            data: params
                        };
                        $http.post(this.controllerUrl, parameters)
                            .success(function (data) {
                                if (callback !== undefined && callback.constructor === Function)
                                    callback(data);
                            }
                        );
                    }
                },



                /**
                 * Отправляет контроллеру информацию о удаляемом файле
                 * @param {Object} params параметры удаляемого файла
                 * @param {Function} callback Callback-функция
                 */
                delete: function (params, callback) {
                    if (params !== undefined) {
                        var parameters = {
                            action: "delete",
                            data: params
                        };
                        $http.post(this.controllerUrl, parameters)
                            .success(function (data) {
                                if (callback !== undefined && callback.constructor === Function)
                                    callback(data);
                            }
                        );
                    }
                }
            };
        }]);
    })
    .run(function ($files) {
        if ($files.controllerUrl === "" || $files.controllerUrl === undefined)
            $log.warn("$files.controllerUrl not specified!");
    });