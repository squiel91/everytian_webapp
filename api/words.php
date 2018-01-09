<?php

    include_once('debug_config.php');
    include_once('db_config.php');

    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
 
        $word = $_GET['word'];
        $level = $_GET['level'];
        $from_1 = $_GET['from_1'];

        if ($db) {
            if ($word) {
                $SQL = $db->prepare('SELECT * FROM words WHERE word = ?');
                $SQL->bind_param('s', $word);
                $SQL->execute();
                $result = $SQL->get_result();
                
                if ($result->num_rows == 1) {
                    $line_exercise = $result->fetch_assoc();
                    header('Content-Type: application/json; charset=utf-8;');
                    echo $line_exercise['data'];
                } else {
                	header('Content-Type: application/json; charset=utf-8;');
                    echo '{"error": "not found", "word": "'.$word.'"}';
                }
            } else {
                $SQL = null;
                if ($level) {
                    if ($from_1 == 'true') {
                        $SQL = $db->prepare('SELECT * FROM words WHERE level > 0 AND level <= ?');
                    } else {
                        $SQL = $db->prepare('SELECT * FROM words WHERE level = ?');                        
                    }
                    $SQL->bind_param('i', $level);
                } else {
                    $SQL = $db->prepare('SELECT * FROM words');
                }
                $SQL->execute();
                $result = $SQL->get_result();
                $SQL->free_result();
                $SQL->close();

                $list_words = array();
                while ($row = $result->fetch_array(MYSQLI_NUM)) {
                    array_push($list_words, json_decode($row[2]));
                }
	            header('Content-Type: application/json; charset=utf-8;');
	            echo json_encode($list_words, JSON_UNESCAPED_UNICODE);
            }
        } else {
            echo "DB problems.";
        }
    }
?>