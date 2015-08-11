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
                    add_flower($postdata);
                    break;
                case "save":
                    save_flower($postdata);
                    break;
            }
        }
    }


    function add_flower ($postdata) {
        $flower_title = $postdata -> data -> title;
        $flower_description = $postdata -> data -> description;
        $flower_price = $postdata -> data -> price;
        $flower_height = $postdata -> data -> height;
        $flower_country = $postdata -> data -> country;
        $added_flower_id = 0;

        $add_flower_query = mysql_query("INSERT INTO flowers (title, description, height, country, price) VALUES ('$flower_title', '$flower_description', '$flower_height', '$flower_country', $flower_price)");
        if (!add_flower_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            $added_flower_id = mysql_insert_id();
            $added_flower_query = mysql_query("SELECT * FROM flowers WHERE id = $added_flower_id");
            if (!$added_flower_query) {
                $result = new DBError(mysql_errno(), mysql_error());
                echo(json_encode($result));
            } else {
                $flower_row = mysql_fetch_assoc($added_flower_query);
                echo(json_encode($flower_row));
                mysql_free_result($added_flower_query);
            }
        }
        mysql_free_result($add_flower_query);
        mysql_close($link);
    }

    function save_flower ($postdata) {
        $flower_id =  $postdata -> data -> flowerId;
        $flower_title = $postdata -> data -> title;
        $flower_description = $postdata -> data -> description;
        $flower_height -> $postdata -> data -> height;
        $flower_country -> $postdata -> data -> country;
        $flower_price = $postdata -> data -> price;
        $result = "";

        $save_flower_query = mysql_query("UPDATE flowers SET title = '$flower_title', description = '$flower_description', height = '$flower_height', country = '$flower_country', price = $flower_price WHERE id = $flower_id");
        if (!$save_flower_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            $result = "success";
        }
        echo(json_encode($result));

        mysql_free_result($save_flower_query);
        mysql_close($link);
    }

?>