<?php

    /**
    * DBError
    * Класс ошибки БД
    **/
    class DBError {
        public $error_type = "DBERROR";
        public $error_code = 0;
        public $error_message = "";

        public function __construct ($code, $message) {
            $this -> error_code = $code;
            $this -> error_message = $message;
        }
    };


    class FSError {
        public $error_type = "FSERROR";
        public $error_message = "";

        public function __construct ($$message) {
            $this -> error_message = $message;
        }
    };


    class File {
        public $path = "";
        public $title = "";
        public $size = 0;

        public function __construct ($file_path) {
            if (file_exists($file_path)) {
                $this -> path = $file_path;
                $this -> title = basename($file_path);
                $this -> size = filesize($file_path);
            }
        }
    };

?>