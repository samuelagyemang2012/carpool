<?php

session_start();

include_once "User.php";
include_once "Pool.php";

if (isset($_REQUEST['cmd'])) {

    $command = $_REQUEST['cmd'];

    switch ($command) {

        case 1:
            sign_up();
            break;

        case 2:
            login();
            break;

        case 3:
            add_pool();
            break;

        case 4:
            get_my_pools();
            break;

        case 5:
            get_all_pools();
            break;

        case 6:
            get_pools_details();
            break;

        case 7:
            join_pool();
            break;

        case 8:
            get_joined_pools();
            break;

        case 9:
            leave_pool();
            break;

        case 10:
            update();
            break;

        default:
            break;
//            echo '{"result":0, "message":"default"}';
    }
}

function sign_up()
{
    $username = $_GET['username'];
    $password = $_GET['password'];
    $phone = $_GET['phone'];
    $payment = $_GET['payment'];

    $user = new User();

    $res = $user->sign_up($username, $password, $phone, $payment);
//
    if ($res == false) {

        echo '{"result":0}';
    } else {
        echo '{"result":1, "message": "Sign-up successful"}';
    }
}

function login()
{
    $username = $_GET['username'];
    $password = $_GET['password'];

//    echo '{"result":0, "username":"'.$username. '", "password":"'.$password.'"}';
    $user = new User();

    $data = $user->login($username, $password);
    $row = $data->fetch_assoc();
    $res_int = $data->num_rows;


    $id = $row['id'];

    if ($res_int <= 0) {
        echo '{"result":0}';//, "message":"wrong username or password"}';
    }

    if ($res_int > 0) {
        $_SESSION['id'] = $id;
        $_SESSION['logged_in'] = true;
        echo '{"result":1, "id":' . $id . '}';
    }
}

function add_pool()
{
    $name = $_GET['name'];
    $seats = $_GET['seats'];
    $date = $_GET['date'];
    $time = $_GET['time'];
    $cost = $_GET['cost'];
    $destination = $_GET['dest'];
    $departure = $_GET['dep'];
    $cid = $_GET['cid'];

    $pool = new Pool();

    $res = $pool->insert($name, $seats, $date, $time, $cost, $destination, $departure, $cid);

    if ($res == false) {

        echo '{"result":0}';
    } else {
        echo '{"result":1}';
    }
}

function get_my_pools()
{
    $id = $_GET['id'];

    $pool = new Pool();

    $results = $pool->get_my_pools($id);

    if (!$results) {
        echo '{"result":0}';
    } else {

        $rows = $results->fetch_assoc();
        $res_int = $results->num_rows;

        echo '{"result":1, "size":' . $res_int . ', "mpools":[';

        while ($rows) {
            echo json_encode($rows);
            $rows = $results->fetch_assoc();

            if ($rows) {
                echo ",";
            }
        }
        echo "]}";
    }
}

function get_all_pools()
{
    $id = $_GET['id'];

    $pool = new Pool();

    $results = $pool->get_all_pools($id);

    if (!$results) {
        echo '{"result":0}';
    } else {

        $rows = $results->fetch_assoc();
        $res_int = $results->num_rows;

        echo '{"result":1, "size":' . $res_int . ', "apools":[';

        while ($rows) {
            echo json_encode($rows);
            $rows = $results->fetch_assoc();

            if ($rows) {
                echo ",";
            }
        }
        echo "]}";
    }
}

function get_pools_details()
{
    $id = $_GET['id'];

    $pool = new Pool();

    $results = $pool->get_pool_details($id);

    if (!$results) {
        echo '{"result":0}';
    } else {

        $rows = $results->fetch_assoc();
        echo '{"result":1, "id":' . $rows['id'] . ', "name":"' . $rows['pool_name'] . '", "seats": ' . $rows['seats'] . ',"date":"' . $rows['date'] . '", "time":"' . $rows['time'] . '","cost":"' . $rows['cost'] . '", "dest":"' . $rows['to_location'] . '", "dep":"' . $rows['from_location'] . '"}';

    }
}

function join_pool()
{
    $uid = $_GET['uid'];
    $pid = $_GET['pid'];

    $pool = new Pool();

    $result = $pool->join_pool($uid, $pid);

    if ($result == 0) {
        echo '{"result":0}';
    } else if ($result == 1) {
        echo '{"result":1}';
    } else {
        echo '{"result":2}';
    }
}

function get_joined_pools()
{
    $uid = $_GET['uid'];

    $pool = new Pool();

    $results = $pool->get_joined_pools($uid);

    if (!$results) {
        echo '{"result":0}';
    } else {

        $rows = $results->fetch_assoc();
        $res_int = $results->num_rows;

        echo '{"result":1, "size":' . $res_int . ', "jpools":[';

        while ($rows) {
            echo json_encode($rows);
            $rows = $results->fetch_assoc();

            if ($rows) {
                echo ",";
            }
        }
        echo "]}";
    }
}

function leave_pool()
{
    $pid = $_GET['pid'];
    $uid = $_GET['uid'];

    $pool = new Pool();

    $bool = $pool->leave_pool($uid, $pid);

    if ($bool == false) {
        echo '{"result":0}';
    } else {
        echo '{"result":1}';
    }
}

function update()
{

    $name = $_GET['name'];
    $seats = $_GET['seats'];
    $date = $_GET['date'];
    $time = $_GET['time'];
    $cost = $_GET['cost'];
    $to_location = $_GET['dest'];
    $from_location = $_GET['dep'];
    $pid = $_GET['pid'];

    $pool = new Pool();

    $res = $pool->update_pool($name, $seats, $date, $time, $cost, $to_location, $from_location, $pid);

    if ($res == true) {
        echo '{"result":1}';
    } else {
        echo '{"result":0}';
    }
}
