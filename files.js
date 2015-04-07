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
                 * ������������� ��������� ���������� �������� ������ � ������
                 * @param {Boolean} flag ���� ���������� �������� ������
                 * @returns {Boolean}
                 */
                loading: function (flag) {
                    if (flag !== undefined && flag.constructor === Boolean) {
                        this.isLoading = flag;
                        return flag;
                    }
                },



                /**
                 * ������������� url ���������� ����������� ��� ������
                 * @param {String} controllerUrl Url �����������
                 */
                setController: function (controllerUrl) {
                    if (controllerUrl !== undefined) {
                        module.controllerUrl = controllerUrl;
                        return true;
                    } else
                        return false;
                },



                /**
                 * ���������� ���������� � ����������� ����� �����������
                 * @param {Object} params ��������� ������������ �����
                 * @param {Function} callback Callback-�������
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
                 * ���������� ����������� ���������� � ��������� �����
                 * @param {Object} params ��������� ���������� �����
                 * @param {Function} callback Callback-�������
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