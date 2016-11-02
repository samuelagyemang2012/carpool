<?php

include_once("Adb.php");

/**
 * Created by PhpStorm.
 * User: samuel
 * Date: 10/29/2016
 * Time: 10:06 PM
 */
include_once("Adb.php");

class Pool extends Adb
{
    function insert($pool_name, $seats, $date, $time, $cost, $to_location, $from_location, $creator_id)
    {
        $query = "INSERT INTO pool(pool_name,seats,date,time,cost,to_location,from_location, creator_id) VALUES (?,?,?,?,?,?,?,?)";
        $s = $this->prepare($query);
        $s->bind_param('sississi', $pool_name, $seats, $date, $time, $cost, $to_location, $from_location, $creator_id);
        $bool = $s->execute();
        return $bool;
    }

    function delete_pool($id)
    {
        $query = "DELETE FROM `pool` WHERE id =?";
        $s = $this->prepare($query);
        $s->bind_param('i', $id);
        $bool = $s->execute();
        return $bool;
    }

    function get_my_pools($id)
    {
        $query = "SELECT * FROM pool WHERE creator_id =?";
        $s = $this->prepare($query);
        $s->bind_param('i', $id);
        $s->execute();
        return $s->get_result();
    }

    function get_pool_details($id)
    {
        $query = "SELECT * FROM pool WHERE id=?";
        $s = $this->prepare($query);
        $s->bind_param('i', $id);
        $s->execute();
        return $s->get_result();
    }

    function get_all_pools($id)
    {
        $query = "SELECT * FROM pool WHERE creator_id !=?";
        $s = $this->prepare($query);
        $s->bind_param('i', $id);
        $s->execute();
        return $s->get_result();
    }

    function get_seats($pid)
    {
        $query = "SELECT seats FROM pool WHERE id=?";
        $s = $this->prepare($query);
        $s->bind_param('i', $pid);
        $s->execute();
        $data = $s->get_result();
        $row = $data->fetch_assoc();
        $int = $row['seats'];

        return $int;
    }

    function already_in_pool($uid, $pid)
    {
        $query = "SELECT * FROM user_join WHERE user_id =? AND pool_id = ?";
        $s = $this->prepare($query);
        $s->bind_param('ii', $uid, $pid);
        $s->execute();
        return $s->get_result();
    }

    function add_to_pool($uid, $pid)
    {
        $query = "INSERT INTO user_join (user_id,pool_id) VALUES (?,?)";
        $s = $this->prepare($query);
        $s->bind_param('ii', $uid, $pid);
        $bool = $s->execute();
        return $bool;
    }

    function reduce_seat($val, $pid)
    {
        $query = "UPDATE `pool` SET `seats`=? WHERE id=?";
        $s = $this->prepare($query);
        $s->bind_param('ii', $val, $pid);
        $bool = $s->execute();
        return $bool;
    }

    function join_pool($uid, $pid)
    {
        $int = $this->get_seats($pid);

        $data1 = $this->already_in_pool($uid, $pid);
        $result1 = $data1->num_rows;

        //if full return false
        if ($int <= 0) {
            return 0;
        }

        //if not part of specific pool, add
        if ($int > 0 && $result1 <= 0) {
            $this->add_to_pool($uid, $pid);
            $new_val = $int - 1;
            $this->reduce_seat($new_val, $pid);
            return 1;
        }

        //if already in pool, cant join
        if ($int > 0 && $result1 > 0) {
            return 2;
        }

    }

    function get_join_id($uid, $pid)
    {
        $query = "SELECT j_id FROM user_join WHERE user_id =? AND pool_id=?";
        $s = $this->prepare($query);
        $s->bind_param('ii', $uid, $pid);
        $s->execute();
        $data = $s->get_result();

        $row = $data->fetch_assoc();

        $id = $row['j_id'];

        return $id;
    }

    //leave pool;
    function delete_join($jid)
    {
        $query = "DELETE FROM user_join WHERE j_id=?";

        $s = $this->prepare($query);
        $s->bind_param('i', $jid);
        $bool = $s->execute();

        return $bool;
    }

    function add_seat($val, $pid)
    {
        $query = "UPDATE `pool` SET `seats`=? WHERE id=?";
        $s = $this->prepare($query);
        $s->bind_param('ii', $val, $pid);
        $bool = $s->execute();
        return $bool;
    }

    function leave_pool($uid, $pid)
    {
        $jid = $this->get_join_id($uid, $pid);
        $this->delete_join($jid);
        $seats = $this->get_seats($pid);
        $val = $seats + 1;
        $bool = $this->add_seat($val, $pid);
        return $bool;
    }

    function get_joined_pools($uid)
    {
        $query = "SELECT j.user_id, j.j_id, p.id, p.pool_name, p.seats, p.date, p.time, p.cost, p.to_location, p.from_location FROM pool p
                  INNER JOIN user_join j WHERE j.user_id=? AND p.id = j.pool_id";
        $s = $this->prepare($query);
        $s->bind_param('i', $uid);
        $s->execute();
        return $s->get_result();
    }

    function update_pool($pool_name, $seats, $date, $time, $cost, $to_location, $from_location, $pid)
    {
        $query = "UPDATE `pool` SET `pool_name`=?,`seats`=?,`date`=?,`time`=?,`cost`=?,`to_location`=?,`from_location`=? WHERE id=?";
        $s = $this->prepare($query);
        $s->bind_param('sississi', $pool_name, $seats, $date, $time, $cost, $to_location, $from_location, $pid);
        $bool = $s->execute();
        return $bool;
    }
}

//$p = new Pool();
//
//$z = $p->get_join_id(48, 7);
//
//echo $z;