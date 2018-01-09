<?php
        
    include_once('debug_config.php');
    include_once('db_config.php');  
    
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
 
        $id = $_GET['id'];
        $level = $_GET['level'];

        if ($db) {
            if ($id) {
                $SQL = $db->prepare('SELECT * FROM exercises WHERE id = ?');
                $SQL->bind_param('s', $id);
                $SQL->execute();
                $result = $SQL->get_result();
                
                if ($result->num_rows == 1) {
                    $line_exercise = $result->fetch_assoc();
                    header('Content-Type: application/json; charset=utf-8;');
                    echo $line_exercise['exercise'];
                } else {
                    echo 'Exercise not found';
                }
            } else {
                $SQL = null;
                if ($level) {
                    $SQL = $db->prepare('SELECT * FROM exercises WHERE level = ?');
                    $SQL->bind_param('i', $level);
                } else {
                    $SQL = $db->prepare('SELECT * FROM exercises');
                }
                $SQL->execute();
                $result = $SQL->get_result();
                $SQL->free_result();
                $SQL->close();

                $list_exercises = array();
                while ($row = $result->fetch_array(MYSQLI_NUM)) {
                    array_push($list_exercises, json_decode($row[2]));
                }
                header('Content-Type: application/json; charset=utf-8;');
                echo json_encode($list_exercises, JSON_UNESCAPED_UNICODE);
            }
        } else {
            echo "DB problems.";
        }
    }
?>