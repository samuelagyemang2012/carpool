<?php

/**
 * Created by PhpStorm.
 * User: samuel
 * Date: 10/26/2016
 * Time: 9:39 PM
 */
include_once('Adb.php');

class User extends Adb
{

    function sign_up($username, $password, $phone, $payment)
    {
        $query = "INSERT INTO user(username,password,phone,payment_id) VALUES (?,?,?,?)";
        $s = $this->prepare($query);
        $s->bind_param('sssi', $username, $password, $phone, $payment);
        $bool = $s->execute();
        return $bool;
    }

    function login($username, $password)
    {
        $query = "SELECT * FROM user WHERE username = ? AND password = ?";
        $s = $this->prepare($query);
        $s->bind_param('ss', $username, $password);
        $s->execute();
        return $s->get_result();
        //return $result;//->num_rows;
    }
}

//$cp = new User();

//$bool = $cp->login("samuel","blender13");
//echo $bool;