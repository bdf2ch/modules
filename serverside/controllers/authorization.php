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
            mysql_query("SET NAMES utf8");
            mysql_query("SET CHARACTER SET utf8");
            mysql_query("SET SESSION collation_connection = utf8_general_ci");

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
        $query = mysql_query("SELECT id, name, fname, surname, email, phone FROM users WHERE email = '$login' AND password = '$passwd' LIMIT 1");
        if (!$query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            if (mysql_num_rows($query) > 0) {
                $result = new stdClass;
                $result -> user = mysql_fetch_assoc($query);
                $result -> data = new stdClass;
                $result -> data -> orders = array();
                $userId = $result -> user -> id;
                //$orders = array();

                $user_orders_query = mysql_num_rows("SELECT * FROM orders WHERE user_id = $userId ORDER BY created ASC");
                if (!$user_orders_query) {
                    $result = new DBError(mysql_errno(), mysql_error());
                    echo(json_encode($result));
                } else {
                    while ($order = mysql_fetch_assoc($user_orders_query)) {
                        array_push($result -> data -> orders, $order);
                    }
                    //$result["orders"] = $orders;
                    mysql_free_result($user_orders_query);
                }
            }
        }
        echo(json_encode($result));

        /* Закрываем соединение с БД и освобождаем ресурсы */
        mysql_free_result($query);
        mysql_close($link);
    };


?>