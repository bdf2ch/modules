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
                case "changeReason":
                    change_reason($postdata);
                    break;
            }
        }
    }

    /**
    * ��������� ����������� ������������ � �������
    **/
    function change_reason ($postdata) {
        $result = "";
        $bouquetId = $postdata -> data -> bouquetId;
        $reasonId = $postdata -> data -> reasonId;
        $value = $postdata -> data -> value;


        $get_reasons_query = mysql_query("SELECT * FROM bouquet_reasons WHERE bouquet_id = $bouquet_id AND reason_id = $reason_id");
        if (!$get_reasons_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            if (mysql_num_rows($get_reasons_query) > 0) {
                $set_reason_query = mysql_query("UPDATE bouquet_reasons SET value = $value WHERE bouquet_id = $bouquet_id AND reason_id = $reason_id");
                if (!$set_reason_query) {
                    $result = new DBError(mysql_errno(), mysql_error());
                    echo(json_encode($result));
                } else {
                    $result = "success";
                }
            } else {
                $add_reason_query = mysql_query("INSERT INTO bouquet_reasons (bouquet_id, reason_id, value) VALUES ($bouquet_id, $reason_id, $value)");
                if (!$add_reason_query) {
                    $result = new DBError(mysql_errno(), mysql_error());
                    echo(json_encode($result));
                } else {
                    $result = "success";
                }
            }
        }

        echo(json_encode($result));

        /* ��������� ���������� � �� � ����������� ������� */
        mysql_free_result($get_reasons_query);
        mysql_close($link);
    };


?>