<?php
    include("../core.php");
    $root_dir = "/";
    $result;

    /* проверяем на доступность корневого каталога */
    if (file_exists($root_dir)) {

        /* Проверяем является ли корневая папка директорией*/
        if (is_dir($root_dir)) {
            $result = "all right beatch";
        } else {
            $error = new FSError("Заданная корневая папка '".root_dir."' не является директорией");
            $result = json_encode($error);
        }

    } else {
        $error = new FSError("Директория '".$root_dir."' не существует");
        $result = json_encode($error);
    }

    /* Возвращаем результат */
    echo ($result);

?>