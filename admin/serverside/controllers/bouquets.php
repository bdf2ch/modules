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
                case "changeReason":
                    change_reason($postdata);
                    break;
                case "changeAddressee":
                    change_addressee($postdata);
                    break;
                case "changeCategory":
                    change_category($postdata);
                    break;
                case "save":
                    save_bouquet($postdata);
                    break;
                case "add":
                    add_bouquet($postdata);
                    break;
                case "addFlower":
                    add_flower($postdata);
                    break;
                case "deleteFlower":
                    delete_flower($postdata);
                    break;
                case "editFlower":
                    edit_flower($postdata);
                    break;
                case "addAddition":
                    add_addition($postdata);
                    break;
                case "deleteAddition":
                    delete_addition($postdata);
                    break;
                case "editAddition":
                    edit_addition($postdata);
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


    /**
     * Меняет категорию букета
     **/
    function change_category ($postdata) {
        $result = "";
        $bouquetId = $postdata -> data -> bouquetId;
        $categoryId = $postdata -> data -> categoryId;
        $value = $postdata -> data -> value;


        $get_categories_query = mysql_query("SELECT * FROM bouquet_categories WHERE bouquet_id = $bouquetId AND category_id = $categoryId");
        if (!$get_categories_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            if (mysql_num_rows($get_categories_query) > 0) {
                $set_category_query = mysql_query("UPDATE bouquet_categories SET value = $value WHERE bouquet_id = $bouquetId AND category_id = $categoryId");
                if (!$set_category_query) {
                    $result = new DBError(mysql_errno(), mysql_error());
                    echo(json_encode($result));
                } else {
                    $result = "success";
                }
            } else {
                $add_category_query = mysql_query("INSERT INTO bouquet_categories (bouquet_id, category_id, value) VALUES ($bouquetId, $categoryId, $value)");
                if (!$add_category_query) {
                    $result = new DBError(mysql_errno(), mysql_error());
                    echo(json_encode($result));
                } else {
                    $result = "success";
                }
            }
        }

        echo(json_encode($result));

        /* Закрываем соединение с БД и освобождаем ресурсы */
        mysql_free_result($get_categories_query);
        mysql_close($link);
    };


    function save_bouquet ($postdata) {
        $bouquet_id = $postdata -> data -> bouquetId;
        $bouquet_title = $postdata -> data -> title;
        $bouquet_short_description = $postdata -> data -> shortDescription;
        $bouquet_full_description = $postdata -> data -> fullDescription;
        $bouquet_price = $postdata -> data -> price;
        $result = "";

        $edit_bouquet_query = mysql_query("UPDATE bouquets SET title = '$bouquet_title', description_short = '$bouquet_short_description', description_full = '$bouquet_full_description', price = $bouquet_price WHERE id = $bouquet_id");
        if (!$edit_bouquet_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            $result = "success";
        }
        echo(json_encode($result));
        /* Закрываем соединение с БД и освобождаем ресурсы */
        mysql_free_result($edit_bouquet_query);
        mysql_close($link);
    }



    function add_bouquet ($postdata) {
        $bouquet_title = $postdata -> data -> title;
        $bouquet_short_description = $postdata -> data -> short_description;
        $bouquet_full_description = $postdata -> data -> full_description;
        $bouquet_price = $postdata -> data -> price;
        $added_bouquet_id = 0;

        $add_bouquet_query = mysql_query("INSERT INTO bouquets (title, description_short, description_full, price) VALUES ('$bouquet_title', '$bouquet_short_description', '$bouquet_full_description', $bouquet_price)");
        if (!$add_bouquet_query) {
             $result = new DBError(mysql_errno(), mysql_error());
             echo(json_encode($result));
        } else {
            $added_bouquet_id = mysql_insert_id();
            $added_bouquet_query = mysql_query("SELECT * FROM bouquets WHERE id = $added_bouquet_id");
            if (!$added_bouquet_query) {
                $result = new DBError(mysql_errno(), mysql_error());
                echo(json_encode($result));
            } else {
                $bouquet_row = mysql_fetch_assoc($added_bouquet_query);
                echo(json_encode($bouquet_row));
                mysql_free_result($added_bouquet_query);
            }
        }
        /* Закрываем соединение с БД и освобождаем ресурсы */
        mysql_free_result($add_bouquet_query);
        mysql_close($link);
    };



    function add_flower ($postdata) {
        $bouquet_id = $postdata -> data -> bouquetId;
        $flower_id = $postdata -> data -> flowerId;
        $amount = $postdata -> data -> amount;
        $result = "";

        $get_bouquet_flower_query = mysql_query("SELECT * FROM bouquet_flowers WHERE bouquet_id = $bouquet_id AND flower_id = $flower_id");
        if (!$get_bouquet_flower_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            if (mysql_num_rows($get_bouquet_flower_query) > 0) {
                $delete_bouquet_flower_query = mysql_query("DELETE FROM bouquet_flowers WHERE bouquet_id = $bouquet_id AND flower_id = $flower_id");
                if (!$delete_bouquet_flower_query) {
                    $result = new DBError(mysql_errno(), mysql_error());
                    echo(json_encode($result));
                }
                mysql_free_result($get_bouquet_flower_query);
                mysql_free_result($delete_bouquet_flower_query);
            } else {
                $add_flower_query = mysql_query("INSERT INTO bouquet_flowers (bouquet_id, flower_id, amount) VALUES ($bouquet_id, $flower_id, $amount)");
                if (!$add_flower_query) {
                    $result = new DBError(mysql_errno(), mysql_error());
                    echo(json_encode($result));
                } else {
                    $result = "success";
                    echo(json_encode($result));
                }
                mysql_free_result($add_flower_query);
            }
        }

        /* Закрываем соединение с БД и освобождаем ресурсы */
        mysql_close($link);
    };


    function delete_flower ($postdata) {
        $bouquet_id = $postdata -> data -> bouquetId;
        $flower_id = $postdata -> data -> flowerId;
        $result = "";

        $delete_bouquet_flower_query = mysql_query("DELETE FROM bouquet_flowers WHERE bouquet_id = $bouquet_id AND flower_id = $flower_id");
        if (!$delete_bouquet_flower_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            $result = "success";
            echo(json_encode($result));
        }
        /* Закрываем соединение с БД и освобождаем ресурсы */
        mysql_free_result($delete_bouquet_flower_query);
        mysql_close($link);
    };



    function edit_flower ($postdata) {
        $bouquet_id = $postdata -> data -> bouquetId;
        $flower_id = $postdata -> data -> flowerId;
        $amount = $postdata -> data -> amount;
        $result = "";

        $edit_bouquet_flower_query = mysql_query("UPDATE bouquet_flowers SET amount = $amount WHERE bouquet_id = $bouquet_id AND flower_id = $flower_id");
        if (!edit_bouquet_flower_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            $result = "success";
            echo(json_encode($result));
        }
        /* Закрываем соединение с БД и освобождаем ресурсы */
        mysql_free_result($edit_bouquet_flower_query);
        mysql_close($link);
    };



    function add_addition ($postdata) {
        $bouquet_id = $postdata -> data -> bouquetId;
        $addition_id = $postdata -> data -> additionId;
        $amount = $postdata -> data -> amount;
        $result = "";

        $get_bouquet_addition_query = mysql_query("SELECT * FROM bouquet_additions WHERE bouquet_id = $bouquet_id AND addition_id = $addition_id");
        if (!$get_bouquet_addition_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            if (mysql_num_rows($get_bouquet_addition_query) > 0) {
                $delete_bouquet_addition_query = mysql_query("DELETE FROM bouquet_additions WHERE bouquet_id = $bouquet_id AND addition_id = $addition_id");
                if (!$delete_bouquet_addition_query) {
                    $result = new DBError(mysql_errno(), mysql_error());
                    echo(json_encode($result));
                }
                mysql_free_result($get_bouquet_addition_query);
                mysql_free_result($delete_bouquet_addition_query);
            } else {
                $add_addition_query = mysql_query("INSERT INTO bouquet_additions (bouquet_id, addition_id, amount) VALUES ($bouquet_id, $addition_id, $amount)");
                if (!$add_addition_query) {
                    $result = new DBError(mysql_errno(), mysql_error());
                    echo(json_encode($result));
                } else {
                    $result = "success";
                    echo(json_encode($result));
                }
                mysql_free_result($add_addition_query);
            }
        }

        /* Закрываем соединение с БД и освобождаем ресурсы */
        mysql_close($link);
    };



    function delete_addition ($postdata) {
        $bouquet_id = $postdata -> data -> bouquetId;
        $addition_id = $postdata -> data -> additionId;
        $result = "";

        $delete_bouquet_addition_query = mysql_query("DELETE FROM bouquet_additions WHERE bouquet_id = $bouquet_id AND addition_id = $addition_id");
        if (!$delete_bouquet_addition_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            $result = "success";
            echo(json_encode($result));
        }
        /* Закрываем соединение с БД и освобождаем ресурсы */
        mysql_free_result($delete_bouquet_addition_query);
        mysql_close($link);
    };



    function edit_addition ($postdata) {
        $bouquet_id = $postdata -> data -> bouquetId;
        $addition_id = $postdata -> data -> additionId;
        $amount = $postdata -> data -> amount;
        $result = "";

        $edit_bouquet_addition_query = mysql_query("UPDATE bouquet_additions SET amount = $amount WHERE bouquet_id = $bouquet_id AND addition_id = $addition_id");
        if (!edit_bouquet_addition_query) {
            $result = new DBError(mysql_errno(), mysql_error());
            echo(json_encode($result));
        } else {
            $result = "success";
            echo(json_encode($result));
        }
        /* Закрываем соединение с БД и освобождаем ресурсы */
        mysql_free_result($edit_bouquet_addition_query);
        mysql_close($link);
    };

?>