<?php

    include "../config.php";
    include "../core.php";

    $postdata = json_decode(file_get_contents('php://input'));
    $action = $postdata -> action;

    /* ����������� � �� */
    $link = mysql_connect($db_host, $db_user, $db_password);
    if (!$link) {
        //die('������ ����������: ' . mysql_error());
        $result = new DBError(mysql_errno(), mysql_error());
        echo(json_encode($result));
    } else {
        /* �������� �� */
        $db_selected = mysql_select_db($db_name, $link);
        if (!$db_selected) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
            //die ('�� ������� ������� ���� ������: ' . mysql_error());
        } else {
            mysql_query("SET NAMES utf-8");

            /* �������� �������� */
            switch ($action) {
                case "add":
                    add_flower($postdata);
                    break;
                case "edit":
                    edit_flower($postdata);
                    break;
            }
        }
    }



    function add_flower ($postdata) {

    }


    function edit_flower ($postdata) {

    }

?>