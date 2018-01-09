<?php

    include_once('debug_config.php');
    include_once('db_config.php');
    
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $email = strtolower($_POST['email']);
        $pass = $_POST['pass'];

        $errors = false;
        $messeges = array();

        $last_checkpoint = $_POST['last_checkpoint'];
        $sincronize_data_list = json_decode($_POST['sincronize_data'], true);

        if (!(is_string($pass) && $pass != '')) {
            $errors = true;
            $messeges['invalid_pass'] = true;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors = true;
            $messeges['invalid_email'] = true;
        }

        if(!$errors) {
            
            if ($db) { 
                $SQL = $db->prepare('SELECT * FROM users WHERE email = ?');
                $SQL->bind_param('s', $email);
                $SQL->execute();
                $result = $SQL->get_result();

                if ($result->num_rows == 1) {
                    $db_field = $result->fetch_assoc();
                    if (!password_verify($pass, $db_field['password'])) {
                        $errors = true;
                        $messeges['invalid_pass'] = false;
                    } else {
                        $inserted_ids = array();
                        foreach ($sincronize_data_list as $data) {  
                            $SQL = $db->prepare("DELETE FROM progress WHERE email = ? AND resource_id = ?");
                            $SQL->bind_param('ss', $email, $data['id']);
                            $result = $SQL->execute();

                            $SQL = $db->prepare("INSERT INTO progress (email, resource_id, data) VALUES (?, ?, ?)");
                            $json_data = json_encode($data, JSON_UNESCAPED_UNICODE);
                            $SQL->bind_param('sss', $email, $data['id'], $json_data);
                            $result = $SQL->execute();
                            if ($result) {
                                array_push($inserted_ids, $data['id']);
                            }
                        }
                        $need_sincronize = array();
                        $SQL = $db->prepare('SELECT * FROM progress WHERE email = ? AND id > ?');
                        $SQL->bind_param('si', $email, $last_checkpoint);
                        $SQL->execute();
                        $result = $SQL->get_result();
                        $SQL->free_result();
                        $SQL->close();

                        while ($row = $result->fetch_array(MYSQLI_NUM)) {
                            $sending_data = json_decode($row[4], true);
                            if(!in_array($sending_data['id'], $inserted_ids)) {
                                array_push($need_sincronize, $sending_data);
                            }
                        }

                        $maxid = 0;
                        $SQL = $db->prepare('SELECT MAX(id) AS `maxid` FROM `progress`');
                        $SQL->execute();
                        $result = $SQL->get_result();
                        
                        if ($result) {
                            $maxid = $result->fetch_assoc()['maxid'];
                        }

                        $messeges['sincronized_ids'] = $inserted_ids;
                        $messeges['last_checkpoint'] = $maxid;
                        $messeges['need_sincronize'] = $need_sincronize;
                    }
                }
            } else {
                $errors = true;
                $messeges['datebase_error'] = true;
            }
        }
        $messeges['succesfully'] = !$errors;
        header('Content-Type: application/json; charset=utf-8;');
        echo json_encode($messeges, JSON_UNESCAPED_UNICODE);  
    }

?>