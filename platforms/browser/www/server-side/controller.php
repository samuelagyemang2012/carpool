<?php

include_once "User.php";

if (isset($_REQUEST['cmd'])) {

    $command = $_REQUEST['cmd'];

    switch ($command) {

        case 1:
            sign_up();
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

    $pool = new User();

    $res = $pool->sign_up($username, $password, $phone, $payment);
//
    if ($res == false) {
        echo '{"result":0, "message": "Looks like this user already exists."}';
    } else {
        echo '{"result":1, "message": "Sign-up successful"}';
    }
}
