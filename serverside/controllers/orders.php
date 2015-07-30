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
            case "query":
                query_orders($postdata);
                break;
            case "add":
                add_order($postdata);
                break;
        }
    }


    function generate_password () {
        $chars = "qazxswedcvfrtgbnhyujmkiolp1234567890QAZXSWEDCVFRTGBNHYUJMKIOLP";
        $max = 10;
        $size = StrLen($chars)-1;
        $password = null;

        while ($max--)
            $password .= $chars[rand(0, $size)];

        return $password;
    }


    function query_orders ($postdata) {
        $userId = $postdata -> data -> userId;
        $result = array();

        $query = mysql_query("SELECT * FROM orders WHERE user_id = $userId");
        if (!$query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            if (mysql_num_rows($query) > 0) {
                while ($row = mysql_fetch_assoc($query)) {
                    array_push($result, $row);
                }
            }
        }
        echo(json_encode($result));

        /* ��������� ���������� � �� � ����������� ������� */
        mysql_free_result($query);
        mysql_close($link);
    }


    function add_order ($postdata) {
        $userId = $postdata -> data -> userId;
        $customerGenderId = $postdata -> data -> customerGenderId;
        $customerName = $postdata -> data -> customerName;
        $customerFname = $postdata -> data -> customerFname;
        $customerSurname = $postdata -> data -> customerSurname;
        $customerPhone = $postdata -> data -> customerPhone;
        $customerEmail = $postdata -> data -> customerEmail;
        $recieverGenderId = $postdata -> data -> recieverGenderId;
        $customerName = $postdata -> data -> customerName;
        $recieverName = $postdata -> data -> recieverName;
        $recieverFname = $postdata -> data -> recieverFname;
        $recieverSurname = $postdata -> data -> recieverSurname;
        $recieverPhone = $postdata -> data -> recieverPhone;
        $addressCityId = $postdata -> data -> addressCityId;
        $addressStreet = $postdata -> data -> addressStreet;
        $addressBuilding = $postdata -> data -> addressBuilding;
        $addressBuildingIndex = $postdata -> data -> addressBuildingIndex;
        $addressFlat = $postdata -> data -> addressFlat;
        $paymentMethodId = $postdata -> data -> paymentMethodId;
        $deliveryMethodId = $postdata -> data -> deliveryMethodId;
        $customerIsReciever = $postdata -> data -> customerIsReciever;
        $deliveryStartPeriod = $postdata -> data -> deliveryStartPeriod;
        $deliveryEndPeriod = $postdata -> data -> deliveryEndPeriod;
        $comment = $postdata -> data -> comment;
        $result;
        $orders = array();

        if ($userId == 0) {
            $current_timestamp = time();
            $generated_password = generate_password();
            $add_user_query = mysql_query("
                INSERT INTO users (name, fname, surname, email, phone, registered, last_visited, password)
                VALUES ($customerName, $customerFname, $customerSurname, $customerEmail, $customerPhone, $current_timestamp, $current_timestamp, $generated_password)
            ");
            if (!$add_user_query) {
                $result = new DBError(mysql_errno(), mysql_error());
                echo(json_encode($result));
            } else {
                $added_user_id = mysql_insert_id();
                $userId = $added_user_id;
                $added_user_query = mysql_query("SELECT name, fname, surname, email, phone, registered, last_visited FROM USERS WHERE user_id = $added_user_id");
                if (!$added_user_query) {
                    $result = new DBError(mysql_errno(), mysql_error());
                    echo(json_encode($result));
                } else {
                    $user_row = mysql_fetch_assoc($add_user_query);
                    $result["user"] = $user_row;
                }
                mysql_free_result($added_user_query);
            }

            mysql_free_result($add_user_query);
        }

        $add_order_query = mysql_query("
            INSERT INTO orders (user_id, customer_gender_id, customer_name, customer_fname, customer_surname, customer_email,
                                customer_phone, reciever_gender_id, reciever_name, reciever_fname, reciever_surname, reciever_phone,
                                address_city_id, address_street, address_building, address_building_index, address_flat,
                                payment_method_id, delivery_method_id, customer_is_reciever, delivery_start_period,
                                delivery_end_period, comment, created)
            VALUES ($userId, $customerGenderId, $customerName, $customerFname, $customerSurname, $customerEmail, $customerPhone,
                    $recieverGenderId, $recieverName, $recieverFname, $recieverSurname, $recieverPhone, $addressCityId,
                    $addressStreet, $addressBuilding, $addressBuildingIndex, $addressFlat, $paymentMethodId, $deliveryMethodId,
                    $customerIsReciever, $deliveryStartPeriod, $deliveryEndPeriod, $comment, $current_timestamp)
        ");
        if (!$add_order_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            $added_order_id = mysql_insert_id();
            $added_order_query = mysql_query("SELECT * FROM orders WHERE id = $added_order_id");
            if (!$added_order_query) {
                $result = new DBError(mysql_errno(), mysql_error());
                echo(json_encode($result));
            } else {
                $order_row = mysql_fetch_assoc($add_order_query);
                $result["order"] = $order_row;
            }
            mysql_free_result($added_order_query);
        }

        echo(json_encode($result));

        /* ��������� ���������� � �� � ����������� ������� */
        mysql_free_result($add_order_query);
        mysql_close($link);
    }

?>