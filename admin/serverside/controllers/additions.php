<?php
    include "../config.php";
    include "../core.php";

    mb_internal_encoding("UTF-8");
    $postdata = json_decode(file_get_contents('php://input'));
    $action = $postdata -> action;

    /* Подключение к БД */
    $link = mysql_connect($db_host, $db_user, $db_password);
    if (!$link) {
        //die('Ошибка соединения: ' . mysql_error());
        $result = new DBError(mysql_errno(), mysql_error());
        echo(json_encode($result));
    } else {
        //mysql_set_charset("utf8", $link);
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
            //mysql_query("SET character_set_results = 'utf8', character_set_client = 'utf8', character_set_connection = 'utf8', character_set_database = 'utf8', character_set_server = 'utf8'", $link);


            /* Выбираем действие */
            switch ($action) {
                case "add":
                    add_addition($postdata);
                    break;
                case "save":
                    save_addition($postdata);
                    break;
            }
        }
    }


    function add_addition ($postdata) {
        $addition_title = $postdata -> data -> title;
        $addition_description = $postdata -> data -> description;
        $addition_price = $postdata -> data -> price;
        $added_addition_id = 0;

        $add_addition_query = mysql_query("INSERT INTO additions (title, description, price) VALUES ('$addition_title', '$addition_description', $addition_price)");
        if (!add_addition_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            $added_addition_id = mysql_insert_id();
            $added_addition_query = mysql_query("SELECT * FROM additions WHERE id = $added_addition_id");
            if (!$added_addition_query) {
                $result = new DBError(mysql_errno(), mysql_error());
                echo(json_encode($result));
            } else {
                $addition_row = mysql_fetch_assoc($added_addition_query);
                echo(json_encode($addition_row));
                mysql_free_result($added_addition_query);
            }
        }
        mysql_free_result($add_addition_query);
        mysql_close($link);
    };



    function save_addition ($postdata) {
        $addition_id =  $postdata -> data -> additionId;
        $addition_title = $postdata -> data -> title;
        $addition_description = $postdata -> data -> description;
        $addition_price = $postdata -> data -> price;
        $result = "";

        $save_addition_query = mysql_query("UPDATE additions SET title = '$addition_title', description = '$addition_description', price = $addition_price WHERE id = $addition_id");
        if (!$save_addition_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            $result = "success";
        }
        echo(json_encode($result));

        mysql_free_result($save_addition_query);
        mysql_close($link);
    }

?>