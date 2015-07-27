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
        $result = "";
        $bouquetId = $postdata -> data -> bouquetId;
        $reasonId = $postdata -> data -> reasonId;
        $value = $postdata -> data -> value;


        $get_reasons_query = mysql_query("SELECT * FROM bouquet_reasons WHERE bouquet_id = $bouquet_id AND reason_id = $reason_id");
        if (!$query_reasons_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            if (mysql_num_rows($query_get_reasons) > 0) {
                $query_set_reason = mysql_query("UPDATE bouquet_reasons SET value = $value WHERE bouquet_id = $bouquet_id AND reason_id = $reason_id");
                if (!$query_set_reason) {
                    $result = new DBError(mysql_errno(), mysql_error());
                    echo(json_encode($result));
                } else {
                    $result = "success";
                }
            } else {
                $query_add_reason = mysql_query("INSERT INTO bouquet_reasons (bouquet_id, reason_id, value) VALUES ($bouquet_id, $reason_id, $value)");
                if (!query_add_reason) {
                    $result = new DBError(mysql_errno(), mysql_error());
                    echo(json_encode($result));
                } else {
                    $result = "success";
                }
            }
        }

        echo(json_encode($result));

        /* Закрываем соединение с БД и освобождаем ресурсы */
        mysql_free_result($query);
        mysql_close($link);
    };


?>