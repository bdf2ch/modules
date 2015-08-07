<?php

    include("../config.php");
    include("../core.php");

    $postdata = json_decode(file_get_contents('php://input'));
    $action = $postdata -> action;

    /* Подключение к БД */
    $link = mysql_connect($db_host, $db_user, $db_password);
    if (!$link) {
        $result = new DBError(mysql_errno(), mysql_error());
        echo(json_encode($result));
    } else {
        /* Выбираем БД */
        $db_selected = mysql_select_db($db_name, $link);
        if (!$db_selected) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            mysql_query("SET NAMES utf8");
            mysql_query("SET CHARACTER SET utf8");
            mysql_query("SET SESSION collation_connection = utf8_general_ci");
            //if (!encoding_query) {
            //    $result = new DBError(mysql_errno(), mysql_error());
            //    echo(json_encode($result));
            //}
        }

        /* Выбираем действие */
        switch ($action) {
            case "edit":
                edit_user($postdata);
                break;
        }
    }


    function edit_user ($postdata) {
        $userId = $postdata -> data -> userId;
        $name = $postdata -> data -> name;
        $fname = $postdata -> data -> fname;
        $surname = $postdata -> data -> surname;
        $email = $postdata -> data -> email;
        $phone = $postdata -> data -> phone;
        $result = "";

        //echo(json_encode($postdata -> data));

        $edit_user_query = mysql_query("UPDATE users SET name = '$name', fname = '$fname', surname = '$surname', email = '$email', phone = '$phone' WHERE id = $userId");
        if (!$edit_user_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            $result = "success";
        }

        echo(json_encode($result));

        /* Закрываем соединение с БД и освобождаем ресурсы */
        mysql_free_result($edit_user_query);
        mysql_close($link);
    };

?>