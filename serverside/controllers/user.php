<?php

    include("../config.php");
    include("../core.php");

    $postdata = json_decode(file_get_contents('php://input'));
    $action = $postdata -> action;

    /* ����������� � �� */
    $link = mysql_connect($db_host, $db_user, $db_password);
    if (!$link) {
        $result = new DBError(mysql_errno(), mysql_error());
        echo(json_encode($result));
    } else {
        /* �������� �� */
        $db_selected = mysql_select_db($db_name, $link);
        if (!$db_selected) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            $encoding_query = mysql_query("SET NAMES utf-8");
            if (!encoding_query) {
                $result = new DBError(mysql_errno(), mysql_error());
                echo(json_encode($result));
            }
        }

        /* �������� �������� */
        switch ($action) {
            case "edit":
                query_orders($postdata);
                break;
        }
    }


    function edit ($postdata) {
        $userId = $postdata -> data -> userId;
        $userName = $postdata -> data -> userName;
        $userFname = $postdata -> data -> userFname;
        $userSurname = $postdata -> data -> userSurname;
        $userEmail = $postdata -> data -> userEmail;
        $userPhone = $postdata -> data -> userPhone;
        $result = "";

        $edit_user_query = mysql_query("UPDATE users SET name = $userName, fname = $userFname, surname = $userSurname, email = $userEmail, phone = $userPhone WHERE id = $userId")
        if (!$edit_user_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            $result = "success";
        }

        echo(json_encode($result));

         /* ��������� ���������� � �� � ����������� ������� */
          mysql_free_result($edit_user_query);
          mysql_close($link);
    };

?>