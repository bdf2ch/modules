<?php
    include "../config.php";
    include "../core.php";

    $postdata = json_decode(file_get_contents('php://input'));
    $action = $postdata -> action;

    /* Подключение к БД */
    $link = mysql_connect($db_host, $db_user, $db_password);
    if (!$link) {
        //die('Ошибка соединения: ' . mysql_error());
        $result = new DBError(mysql_errno(), mysql_error());
        echo(json_encode($result));
    } else {
        /* Выбираем БД */
        $db_selected = mysql_select_db($db_name, $link);
        if (!$db_selected) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
            //die ('Не удалось выбрать базу данных: ' . mysql_error());
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
    function changeReason ($postdata) {
        $result = -1;
        $login = $postdata -> data -> username;
        $passwd = $postdata -> data -> password;

        echo(json_encode($result));

        /* Закрываем соединение с БД и освобождаем ресурсы */
        mysql_free_result($query);
        mysql_close($link);
    };


?>