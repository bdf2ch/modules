<?php
    include "../config.php";

    $postdata = json_decode(file_get_contents('php://input'));
    $action = $postdata -> action;

    /* Подключение к БД */
    $link = mysql_connect($db_host, $db_user, $db_password);
    if (!$link) {
        die('Ошибка соединения: ' . mysql_error());
    } else {
        /* Выбираем БД */
        $db_selected = mysql_select_db($db_name, $link);
        if (!$db_selected) {
            die ('Не удалось выбрать базу данных: ' . mysql_error());
        } else {
            mysql_query("SET NAMES utf-8");

            /* Выбираем действие */
            switch ($action) {
                case "logIn":
                    logIn($postdata);
                    break;
                case "remindPassword":
                    remindPassword($postdata);
                    break;
            }
        }
    }

    /**
    * Выполняет авторизацию пользователя в системе
    **/
    function logIn ($postdata) {
        $result = -1;
        $login = $postdata -> data -> username;
        $passwd = $postdata -> data -> password;
        $query = mysql_query("SELECT * FROM gears_users WHERE user_login = '$login' AND user_password = '$passwd'");
        if (!$query) {
            die('Неверный запрос: ' . mysql_error());
        } else {
            if (mysql_num_rows($query) > 0) {
                while ($row = mysql_fetch_assoc($query)) {
                    setcookie("_user_", "test");
                    $result = $row;
                }
            }
        }
        echo(json_encode($result));

        /* Закрываем соединение с БД и освобождаем ресурсы */
        mysql_free_result($query);
        mysql_close($link);
    };


?>