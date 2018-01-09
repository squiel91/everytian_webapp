<?php

    include_once('debug_config.php');
    include_once('db_config.php');

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $email = strtolower($_POST['email']);
        $pass = $_POST['pass'];

        $errors = false;
        $messeges = array();

        if (!(is_string($pass) && $pass != '')) {
            $errors = true;
            $messeges['invalid_pass'] = true;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors = true;
            $messeges['invalid_email'] = true;
        }

        if(!$errors) {
            $password_default = '1234';
            
            $sign = $_POST['sign'];
            
            if ($db) { 
                switch ($sign) {
                    case 'in': {
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
                                $messeges['level'] = $db_field['level'];
                            }
                        }
                        else {
                            $errors = true;
                            $messeges['existing_email'] = false;
                        }
                        break;
                    }

                    case 'up': {
                        $level = $_POST['level'];
                        $SQL = $db->prepare('SELECT * FROM users WHERE email = ?');
                        $SQL->bind_param('s', $email);
                        $SQL->execute();
                        $result = $SQL->get_result();

                        if ($result->num_rows > 0) {
                            $errors = true;
                            $messeges['existing_email'] = true;
                        } else {
                            $SQL = $db->prepare("INSERT INTO users (email, password, level) VALUES (?, ?, ?)");
                            $phash = password_hash($pass, PASSWORD_DEFAULT);
                            $SQL->bind_param('sss', $email, $phash, $level);
                            $result = $SQL->execute();
                            if (!$result) {
                                $errors = true;
                                $messeges['could_not_insert_new_user'] = true;
                            }
                        }
                        break;
                    }
                    case 'change_level': {
                        $level = $_POST['level'];
                        
                        $SQL = $db->prepare('SELECT * FROM users WHERE email = ?');
                        $SQL->bind_param('s', $email);
                        $SQL->execute();
                        $result = $SQL->get_result();

                        if ($result->num_rows == 1) {
                            $db_field = $result->fetch_assoc();
                            if (!password_verify($pass, $db_field['password'])) {
                                $errors = true;
                                $messeges['invalid_pass'] = true;
                            } else {
                                $SQL = $db->prepare("UPDATE users SET level = ? WHERE email = ?");
                                $SQL->bind_param('ss', $level, $email);
                                $result = $SQL->execute();
                                if (!$result) {
                                    $errors = true;
                                    $messeges['could_not_modify_user'] = true;
                                }
                            }
                        }
                        else {
                            $errors = true;
                            $messeges['not_existing_email'] = true;
                        }
                        break;
                    }
                    default: {
                        $errors = true;
                        $messeges['not_method_provide'] = true;
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