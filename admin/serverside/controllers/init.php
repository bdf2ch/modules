<?php
    include "../config.php";

    $connection = mysql_connect($db_host, $db_user, $db_password);
    if (!$connection) {
        die('Ошибка соединения: ' .iconv('Windows-1251', 'UTF-8', mysql_error()));
    } else {
        if (!mysql_select_db($db_name, $connection)) {
            die ('Не удалось выбрать базу: ' . mysql_error());
        } else {
            mysql_query("SET NAMES 'utf8'");
        }
    }

    $result = array();
    $reasons = array();
    $bouquets = array();
    $addressees = array();
    $categories = array();
    $images = array();
    $flowers = array();
    $additions = array();
    $payment_methods = array();
    $delivery_methods = array();
    $cities = array();
    $orders = array();

    /* Заполнение массива поводов */
    $query_reasons = mysql_query("SELECT * FROM reasons");
    if (!$query_reasons) {
        die('Неверный запрос: ' . mysql_error());
    } else {
        while ($row = mysql_fetch_assoc($query_reasons)) {
            array_push($reasons, $row);
        }
    }
    $result["reasons"] = $reasons;


    /* Заполнение массива адресатов */
    $query_addressees = mysql_query("SELECT * FROM addressees");
    if (!$query_addressees) {
        die('Неверный запрос: ' . mysql_error());
    } else {
        while ($row = mysql_fetch_assoc($query_addressees)) {
            array_push($addressees, $row);
        }
    }
    $result["addressees"] = $addressees;


    /* Заполнение массива адресатов */
    $query_categories = mysql_query("SELECT * FROM categories");
    if (!$query_categories) {
        die('Неверный запрос: ' . mysql_error());
    } else {
        while ($row = mysql_fetch_assoc($query_categories)) {
            array_push($categories, $row);
        }
    }
    $result["categories"] = $categories;

    /* Заполнение массива букетов */
    $query_bouquets = mysql_query("SELECT * FROM bouquets");
    if (!$query_bouquets) {
        die('Неверный запрос: ' . mysql_error());
    } else {
        while ($row = mysql_fetch_assoc($query_bouquets)) {
            $bouquet_id = $row["id"];
            $bouquet_flowers = array();
            $bouquet_additions = array();
            $bouquet_categories = array();
            $bouquet_reasons = array();
            $bouquet_addressees = array();

            /* Заполнение массива цветов, входящих в состав букета */
            $query_bouquet_flowers = mysql_query("SELECT * FROM bouquet_flowers WHERE bouquet_id = $bouquet_id");
            if (!$query_bouquet_flowers) {
                    die('Неверный запрос: ' . mysql_error());
            } else {
                 while ($flower_row = mysql_fetch_assoc($query_bouquet_flowers)) {
                    array_push($bouquet_flowers, $flower_row);
                 }
                 $row["flowers"] = $bouquet_flowers;
            }

             /* Заполнение массива декоративных оформлений, входящих в состав букета */
            $query_bouquet_additions = mysql_query("SELECT * FROM bouquet_additions WHERE bouquet_id = $bouquet_id");
            if (!$query_bouquet_additions) {
                 die('Неверный запрос: ' . mysql_error());
            } else {
                 while ($addition_row = mysql_fetch_assoc($query_bouquet_additions)) {
                     array_push($bouquet_additions, $addition_row);
                 }
                 $row["additions"] = $bouquet_additions;
            }

            /* Заполнение массива категорий букета */
            $query_bouquet_categories = mysql_query("SELECT * FROM bouquet_categories WHERE bouquet_id = $bouquet_id");
            if (!$query_bouquet_categories) {
                die('Неверный запрос: ' . mysql_error());
            } else {
                while ($category_row = mysql_fetch_assoc($query_bouquet_categories)) {
                    array_push($bouquet_categories, $category_row);
                }
                $row["categories"] = $bouquet_categories;
            }

            /* Заполнение массива поводов подарить букет */
            $query_bouquet_reasons = mysql_query("SELECT * FROM bouquet_reasons WHERE bouquet_id = $bouquet_id");
            if (!$query_bouquet_reasons) {
                die('Неверный запрос: ' . mysql_error());
            } else {
                while ($reason_row = mysql_fetch_assoc($query_bouquet_reasons)) {
                    array_push($bouquet_reasons, $reason_row);
                }
                $row["reasons"] = $bouquet_reasons;
            }

            /* Заполнение массива адресатов, которым можно подарить букет */
            $query_bouquet_addressees = mysql_query("SELECT * FROM bouquet_addressees WHERE bouquet_id = $bouquet_id");
            if (!$query_bouquet_addressees) {
                die('Неверный запрос: ' . mysql_error());
            } else {
                while ($addressee_row = mysql_fetch_assoc($query_bouquet_addressees)) {
                    array_push($bouquet_addressees, $addressee_row);
                }
                $row["addressees"] = $bouquet_addressees;
            }

            array_push($bouquets, $row);
        }
    }
    $result["bouquets"] = $bouquets;

    /* Заполнение массива изображений букетов */
    $query_images = mysql_query("SELECT * FROM bouquet_images");
    if (!$query_images) {
        die('Неверный запрос: ' . mysql_error());
    } else {
        while ($row = mysql_fetch_assoc($query_images)) {
            array_push($images, $row);
        }
    }
    $result["images"] = $images;

    /* Заполнение массива изображений букетов */
    $query_flowers = mysql_query("SELECT * FROM flowers");
    if (!$query_flowers) {
        die('Неверный запрос: ' . mysql_error());
    } else {
        while ($row = mysql_fetch_assoc($query_flowers)) {
            array_push($flowers, $row);
        }
    }
    $result["flowers"] = $flowers;

    /* Заполнение массива добавок у букету */
    $query_additions = mysql_query("SELECT * FROM additions");
    if (!$query_additions) {
        die('Неверный запрос: ' . mysql_error());
    } else {
        while ($row = mysql_fetch_assoc($query_additions)) {
            array_push($additions, $row);
        }
    }
    $result["additions"] = $additions;

    /* Заполнение массива способов оплаты */
    $query_payment_methods = mysql_query("SELECT * FROM payment_methods");
    if (!$query_payment_methods) {
        die('Неверный запрос: ' . mysql_error());
    } else {
        while ($row = mysql_fetch_assoc($query_payment_methods)) {
            array_push($payment_methods, $row);
        }
    }
    $result["payment_methods"] = $payment_methods;


    /* Заполнение массива способов доставки */
    $query_delivery_methods = mysql_query("SELECT * FROM delivery_methods");
    if (!$query_delivery_methods) {
        die('Неверный запрос: ' . mysql_error());
    } else {
        while ($row = mysql_fetch_assoc($query_delivery_methods)) {
            array_push($delivery_methods, $row);
        }
    }
    $result["delivery_methods"] = $delivery_methods;


    /* Заполнение массива городов доставки */
    $query_cities = mysql_query("SELECT * FROM cities");
    if (!$query_cities) {
        die('Неверный запрос: ' . mysql_error());
    } else {
        while ($row = mysql_fetch_assoc($query_cities)) {
            array_push($cities, $row);
        }
    }
    $result["cities"] = $cities;


    /* Заполнение массива заказов */
    $query_orders = mysql_query("SELECT * FROM orders");
    if (!$query_orders) {
        die('Неверный запрос: ' . mysql_error());
    } else {
        while ($row = mysql_fetch_assoc($query_orders)) {
            array_push($orders, $row);
        }
    }
    $result["orders"] = $orders;


    echo(json_encode($result));

    mysql_free_result($query_reasons);
    mysql_free_result($query_addressees);
    mysql_free_result($query_flowers);
    mysql_free_result($query_additions);
    mysql_free_result($query_bouquets);
    mysql_free_result($query_cities);
    mysql_free_result($query_payment_methods);
    mysql_free_result($query_delivery_methods);
    mysql_free_result($query_images);
    mysql_free_result($query_orders);
    mysql_close($connection);
?>