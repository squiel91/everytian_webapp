<?php

    include_once('debug_config.php');
    include_once('db_config.php');

    $messeges = array();
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $data = $_POST['d'];

        if(is_string($data) && $data != '') {   
            if ($db) { 
                $SQL = $db->prepare("INSERT INTO `dumps` (`data`) VALUES (?)");
                $SQL->bind_param('s', $data);
                $result = $SQL->execute();
                if (!$result) {
                    $messeges['error'] = 'Could not insert data';
                } else {
                    $messeges['success'] = true;
                }
            } else {
                $messeges['error'] = 'Can not connect to the datebase'; 
            }
        } else {
            $messeges['error'] = 'Data has to be linked to a "d" named parameter';
        } 
    } else {
        $messeges['error'] = 'Only accepts POST method';
    } 
    header('Content-Type: application/json; charset=utf-8;');
    echo json_encode($messeges, JSON_UNESCAPED_UNICODE); 
?>