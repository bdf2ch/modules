<?php

    /**
    * DBError
    * ����� ������ ��
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

?>