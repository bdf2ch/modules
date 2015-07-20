<?php
    include("libs/xtemplate/xtemplate.class.php");

    //setcookie("_user_", "dasdasdasd");

    if (isset($_COOKIE["_user_"]))
        $template = new XTemplate("templates/gears.html");
    else
        $template = new XTemplate("templates/authorization/authorization.html");

    $template -> parse("main");
    $template -> out("main");
?>