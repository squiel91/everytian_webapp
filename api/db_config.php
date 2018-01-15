<?php
    function is_localhost() {
        $whitelist = array( '127.0.0.1', '::1' );
        if( in_array( $_SERVER['REMOTE_ADDR'], $whitelist) )
            return true;
    }

    if(true) {//is_localhost()){
        $db_server = 'localhost';
        $db_user = 'root';
        $db_pass = 'jaguar';
        $database = "u112104323_qebu";
    } else {
        $db_server = 'mysql.hostinger.com';
        $db_user = 'u112104323_qebu';
        $db_pass = 'Jaguar23';
        $database = "u112104323_qebu";
    }

    $db = new mysqli($db_server, $db_user, $db_pass, $database);
    mysqli_set_charset($db,"utf8");

?>