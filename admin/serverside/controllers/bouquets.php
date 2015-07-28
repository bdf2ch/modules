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
                case "changeReason":
                    change_reason($postdata);
                    break;
                case "changeAddressee":
                    change_addressee($postdata);
                    break;
            }
        }
    }

    /**
    * Выполняет авторизацию пользователя в системе
    **/
    function change_reason ($postdata) {
        $result = "";
        $bouquetId = $postdata -> data -> bouquetId;
        $reasonId = $postdata -> data -> reasonId;
        $value = $postdata -> data -> value;


        $get_reasons_query = mysql_query("SELECT * FROM bouquet_reasons WHERE bouquet_id = $bouquetId AND reason_id = $reasonId");
        if (!$get_reasons_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            if (mysql_num_rows($get_reasons_query) > 0) {
                $set_reason_query = mysql_query("UPDATE bouquet_reasons SET value = $value WHERE bouquet_id = $bouquetId AND reason_id = $reasonId");
                if (!$set_reason_query) {
                    $result = new DBError(mysql_errno(), mysql_error());
                    echo(json_encode($result));
                } else {
                    $result = "success";
                }
            } else {
                $add_reason_query = mysql_query("INSERT INTO bouquet_reasons (bouquet_id, reason_id, value) VALUES ($bouquetId, $reasonId, $value)");
                if (!$add_reason_query) {
                    $result = new DBError(mysql_errno(), mysql_error());
                    echo(json_encode($result));
                } else {
                    $result = "success";
                }
            }
        }

        echo(json_encode($result));

        /* Закрываем соединение с БД и освобождаем ресурсы */
        mysql_free_result($get_reasons_query);
        mysql_close($link);
    };


    /**
     * Выполняет авторизацию пользователя в системе
     **/
    function change_addressee ($postdata) {
        $result = "";
        $bouquetId = $postdata -> data -> bouquetId;
        $addresseeId = $postdata -> data -> addresseeId;
        $value = $postdata -> data -> value;


        $get_addressees_query = mysql_query("SELECT * FROM bouquet_addressees WHERE bouquet_id = $bouquetId AND addressee_id = $addresseeId");
        if (!$get_addressees_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            if (mysql_num_rows($get_addressees_query) > 0) {
                $set_addressee_query = mysql_query("UPDATE bouquet_addressees SET value = $value WHERE bouquet_id = $bouquetId AND addressee_id = $addresseeId");
                if (!$set_addressee_query) {
                    $result = new DBError(mysql_errno(), mysql_error());
                    echo(json_encode($result));
                } else {
                    $result = "success";
                }
            } else {
                $add_addressee_query = mysql_query("INSERT INTO bouquet_addressees (bouquet_id, addressee_id, value) VALUES ($bouquetId, $addresseeId, $value)");
                if (!$add_addressee_query) {
                    $result = new DBError(mysql_errno(), mysql_error());
                    echo(json_encode($result));
                } else {
                    $result = "success";
                }
            }
        }

        echo(json_encode($result));

        /* Закрываем соединение с БД и освобождаем ресурсы */
        mysql_free_result($get_addressees_query);
        mysql_close($link);
    };

?>