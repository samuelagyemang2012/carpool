var global_id, global_pid, global_uid;

function send_request(url) {
    "use strict";
    var obj, result;
    obj = $.ajax({
        url: url,
        async: false
    });
    result = $.parseJSON(obj.responseText);
    return result;
}

function change_page(page, transition) {
    $.mobile.pageContainer.pagecontainer("change", page, {transition: transition});
}

function sign_up() {
    var url, username, password, phone, payment, obj;

    username = $("#s_username").val();
    password = $("#s_password").val();
    phone = $("#s_phone").val();
    payment = $("#payment").val();

    url = "./server-side/controller.php?cmd=1&username=" + username + "&password=" + password + "&phone=" + phone + "&payment=" + payment;
    obj = send_request(url);

    //alert(obj.message);
    if (obj.result == 1) {
        $("#successpopup").popup("open", {transition: "slide"});

        setTimeout(
            function () {
                change_page("#loginpage", "slide")
            }, 800);
    }
    else {
        $("#failpopup").popup("open", {transition: "slide"});
    }
}

function login() {
    var url, username, password, obj;

    username = $("#username").val();
    password = $("#password").val();

    url = "./server-side/controller.php?cmd=2&username=" + username + "&password=" + password;
    obj = send_request(url);

    if (obj.result == 0) {
        $("#loginfailpopup").popup("open", {transition: "slide"});
    }
    else {
        global_id = obj.id;

        //test code
        $.cookie('user_id', global_id);
        //
        get_my_pools();
        //alert(global_id);
    }
}

function add_pool() {
    var url, obj, name, seats, date, time, cost, destination, departure, c_id;

    name = $("#poolname").val();
    seats = $("#poolsize").val();
    date = $("#pooldate").val();
    time = $("#pooltime").val();
    cost = $("#poolcost").val();
    destination = $("#to").val();
    departure = $("#from").val();
    c_id = global_id;

    //alert(name + " " + seats + " " + date + " " + time + " " + cost + " " + destination + " " + departure + " " + c_id);

    url = "./server-side/controller.php?cmd=3&name=" + name + "&seats=" + seats + "&date=" + date + "&time=" + time + "&cost=" + cost + "&dest=" + destination + "&dep=" + departure + "&cid=" + global_id;
    obj = send_request(url);

    if (obj.result == 0) {
        $("#poolnotadded").popup("open", {transition: "slide"});
    } else {
        $("#pooladdedpopup").popup("open", {transition: "slide"});
        clear_pool_data();

        setTimeout(
            function () {
                get_my_pools();
            }, 800);
        //change_page("#mypoolpage", "slide");
        //alert("inserted");
    }

}

function clear_pool_data() {
    var name, seats, date, time, cost, destination, departure;

    name = $("#poolname").val("");
    seats = $("#poolsize").val("");
    date = $("#pooldate").val("");
    time = $("#pooltime").val("");
    cost = $("#poolcost").val("");
    destination = $("#to").val("");
    departure = $("#from").val("");
    //c_id = global_id;
}

function get_my_pools() {
    var url, obj, build;

    url = "./server-side/controller.php?cmd=4&id=" + global_id;

    obj = send_request(url);
    build = "";

    if (obj.size == 0) {
        document.getElementById("mypools").innerHTML = "<h5>You haven't added any pools yet !</h5>";
        change_page("#mypoolpage", "slide");
    } else {
        build += "<label>My Pools</label>";

        for (var i in obj.mpools) {

            build += "<div class='nd2-card'>";
            build += "<div class='card-title'>";
            build += "<h4 class='card-primary-title' style='color: #4CAF50;'>" + obj.mpools[i].pool_name + "</h4>";
            build += "<h5>From " + obj.mpools[i].from_location + " to " + obj.mpools[i].to_location + "</h5>";
            build += "<div class='card-action'>";
            build += "<div class='row between-xs'>";
            build += "<div class='col-xs-12 align-right'>";
            build += "<div class='box'>";
            build += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button' onclick='get_a_pool(" + obj.mpools[i].id + ")'><i class='zmdi zmdi-mail-reply zmd-flip-horizontal'></i></a>";
            build += "</div>";
            build += "</div>";
            build += "</div>";
            build += "</div>";
            build += "</div>";
            build += "</div>";
        }

        $("#mypools").html(build);

        change_page("#mypoolpage", "slide");
    }
}

function get_all_pools() {
    var url, obj, build;

    url = "./server-side/controller.php?cmd=5&id=" + global_id;

    obj = send_request(url);
    build = "";

    if (obj.size == 0) {
        document.getElementById("allpools").innerHTML = "<h5 class='align-center'>No pools yet !</h5>";
        change_page("#alpoolspage", "slide");
    } else {
        build += "<label>All Pools</label>";

        for (var i in obj.apools) {
            build += "<div class='nd2-card'>";
            build += "<div class='card-title'>";
            build += "<h4 class='card-primary-title' style='color: #4CAF50;'>" + obj.apools[i].pool_name + "</h4>";
            build += "<h5>From " + obj.apools[i].from_location + " to " + obj.apools[i].to_location + "</h5>";
            build += "<div class='card-action'>";
            build += "<div class='row between-xs'>";
            build += "<div class='col-xs-12 align-right'>";
            build += "<div class='box'>";
            build += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button' onclick='get_other_pools_details(" + obj.apools[i].id + ")'><i class='zmdi zmdi-mail-reply zmd-flip-horizontal'></i></a>";
            build += "</div>";
            build += "</div>";
            build += "</div>";
            build += "</div>";
            build += "</div>";
            build += "</div>";
        }

        $("#allpools").html(build);

        change_page("#allpoolspage", "slide");
    }
}

function get_a_pool(id) {
    var url, obj, build;

    url = "./server-side/controller.php?cmd=6&id=" + id;

    obj = send_request(url);
    build = "";

    build += "<h4 class='align-center' style='color: #4CAF50;'>" + obj.name + "</h4><hr>";
    build += "<h5 class='align-center' style='color: #4CAF50;'>Seats available</h5>";
    build += "<h2 class='align-center'>" + obj.seats + "</h2><hr>";
    build += "<h5 class='align-center' style='color: #4CAF50;'>Leaves on</h5>";
    build += "<h5 class='align-center'>" + obj.date + " at " + obj.time + "</h5><hr>";
    build += "<h5 class='align-center' style='color: #4CAF50;'>Departure</h5>";
    build += "<h4 class='align-center'>" + obj.dep + "</h4>";
    //build += "<h4 class='align-center' style='color: #4CAF50;'>Seats available</h4>";
    build += "<div class='align-center'>";
    build += "<iframe width='300' height='300' frameborder='0' id='google-map' src='http://maps.google.co.uk?q=" + obj.dep + "&z=60&output=embed'></iframe>";
    build += "</div><hr>";
    build += "<h5 class='align-center' style='color: #4CAF50;'>Destination</h5>";
    build += "<h4 class='align-center'>" + obj.dest + "</h4><hr>";
    build += "<h5 class='align-center' style='color: #4CAF50;'>cost</h5>";
    build += "<h2 class='align-center'> GHC " + obj.cost + "</h2><hr>";

    build += "<div class='row'>";
    build += "<div class='col-xs-6'>";
    build += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button' onclick='get_my_pools()'><i class='zmdi zmdi-arrow-back'></i></a>";
    build += "</div>";
    build += "<div class='col-xs-6 align-right'>";
    build += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button' onclick='get_data_for_update(" + obj.id + ")'><i class='zmdi zmdi-edit'></i></a>";
    build += "</div>";
    //build += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button' onclick=''><i class='zmdi zmdi-account-add'></i></a>";
    build += "</div>"


    $("#apool").html(build);

    change_page("#poolpage", "pop");

}

function get_data_for_update(pid) {

    var obj, url;

    url = "./server-side/controller.php?cmd=6&id=" + pid;

    obj = send_request(url);

    global_uid = pid;

    //alert(obj.time);

    $("#upoolname").val(obj.name);
    $("#upoolsize").val(obj.seats);
    $("#upooldate").val(obj.date);
    $("#upooltime").val(obj.time);
    $("#upoolcost").val(obj.cost);
    $("#uto").val(obj.dest);
    $("#ufrom").val(obj.dep);

    change_page("#editpage", "slide");
}

function update_pool() {

    var url, obj, name, seats, date, time, cost, dest, dep;

    name = $("#upoolname").val();
    seats = $("#upoolsize").val();
    date = $("#upooldate").val();
    time = $("#upooltime").val();
    //alert(time);
    cost = $("#upoolcost").val();
    dest = $("#uto").val();
    dep = $("#ufrom").val();

    url = "./server-side/controller.php?cmd=10&name=" + name + "&seats=" + seats + "&date=" + date + "&time=" + time + "&cost=" + cost + "&dest=" + dest + "&dep=" + dep + "&pid=" + global_uid;

    obj = send_request(url);

    if (obj.result == 1) {
        $("#editsuccess").popup("open", {transition: "slide"});

        setTimeout(
            function () {
                get_my_pools();
            }, 900);
    }
}

function get_other_pools_details(id) {
    var url, obj, build;

    url = "./server-side/controller.php?cmd=6&id=" + id;

    obj = send_request(url);
    build = "";

    build += "<h4 class='align-center' style='color: #4CAF50;'>" + obj.name + "</h4><hr>";
    build += "<h5 class='align-center' style='color: #4CAF50;'>Seats available</h5>";
    build += "<h2 class='align-center'>" + obj.seats + "</h2><hr>";
    build += "<h5 class='align-center' style='color: #4CAF50;'>Leaves on</h5>";
    build += "<h5 class='align-center'>" + obj.date + " at " + obj.time + "</h5><hr>";
    build += "<h5 class='align-center' style='color: #4CAF50;'>Departure</h5>";
    build += "<h4 class='align-center'>" + obj.dep + "</h4>";
    //build += "<h4 class='align-center' style='color: #4CAF50;'>Seats available</h4>";
    build += "<div class='align-center'>";
    build += "<iframe width='300' height='300' frameborder='0' id='google-map' src='http://maps.google.co.uk?q=" + obj.dep + "&z=60&output=embed'></iframe>";
    build += "</div><hr>";
    build += "<h5 class='align-center' style='color: #4CAF50;'>Destination</h5>";
    build += "<h4 class='align-center'>" + obj.dest + "</h4><hr>";
    build += "<h5 class='align-center' style='color: #4CAF50;'>cost</h5>";
    build += "<h2 class='align-center'> GHC " + obj.cost + "</h2><hr>";

    build += "<div class='row'>";
    build += "<div class='col-xs-6'>";
    build += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button' onclick='get_all_pools()'><i style='font-size: 20px' class='zmdi zmdi-arrow-back'></i></a>";
    build += "</div>"
    build += "<div class='col-xs-6 align-right'>"
    build += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button' onclick='join(" + obj.id + ")'><i style='font-size: 20px' class='zmdi zmdi-account-add'></i></a>";
    build += "</div>";
    //build += "<a href='#' style='background-color: gainsboro' class='ui-btn waves-effect waves-button waves-effect waves-button' onclick='join(" + obj.id + ")'><i style='font-size: 20px' class='zmdi zmdi-account-add'></i></a>";
    build += "</div>";

    $("#apool").html(build);

    change_page("#poolpage", "pop");

}

function join(pid) {
    var uid, obj, url;

    uid = global_id;

    url = "./server-side/controller.php?cmd=7&uid=" + uid + "&pid=" + pid;

    obj = send_request(url);

    //alert(obj.result);
    if (obj.result === 0) {
        $("#joinfullpopup").popup("open", {transition: "slide"});
    }

    if (obj.result === 1) {
        $("#joinsuccesspopup").popup("open", {transition: "slide"});

        setTimeout(
            function () {
                change_page("#allpoolspage", "slide")
            }, 800);
    }

    if (obj.result === 2) {
        $("#joinalreadypopup").popup("open", {transition: "slide"});
    }

}

function get_joined_pools() {
    var uid, obj, url, build;

    uid = global_id;

    url = "./server-side/controller.php?cmd=8&uid=" + uid;

    obj = send_request(url);

    build = "";
    if (obj.size == 0) {
        document.getElementById("joinedpools").innerHTML = "<h5>You haven't joined any pools yet !</h5>";
        change_page("#joinpoolpage", "slide");
    }
    else {
        build += "<label>Joined Pools</label>";
        //
        for (var i in obj.jpools) {

            build += "<div class='nd2-card'>";
            build += "<div class='card-title'>";
            build += "<h4 class='card-primary-title' style='color: #4CAF50;'>" + obj.jpools[i].pool_name + "</h4>";
            build += "<h5>From " + obj.jpools[i].from_location + " to " + obj.jpools[i].to_location + "</h5>";
            build += "<div class='card-action'>";
            build += "<div class='row between-xs'>";
            build += "<div class='col-xs-12 align-right'>";
            build += "<div class='box'>";
            build += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button' onclick='get_joined_pools_details(" + obj.jpools[i].id + ")'><i class='zmdi zmdi-mail-reply zmd-flip-horizontal'></i></a>";
            build += "</div>";
            build += "</div>";
            build += "</div>";
            build += "</div>";
            build += "</div>";
            build += "</div>";
        }

        $("#joinedpools").html(build);

        change_page("#joinpoolpage", "slide");
    }
}

function get_joined_pools_details(pid) {

    var url, obj, build;

    url = "./server-side/controller.php?cmd=6&id=" + pid;

    obj = send_request(url);
    build = "";

    build += "<h4 class='align-center' style='color: #4CAF50;'>" + obj.name + "</h4><hr>";
    build += "<h5 class='align-center' style='color: #4CAF50;'>Seats available</h5>";
    build += "<h2 class='align-center'>" + obj.seats + "</h2><hr>";
    build += "<h5 class='align-center' style='color: #4CAF50;'>Leaves on</h5>";
    build += "<h5 class='align-center'>" + obj.date + " at " + obj.time + "</h5><hr>";
    build += "<h5 class='align-center' style='color: #4CAF50;'>Departure</h5>";
    build += "<h4 class='align-center'>" + obj.dep + "</h4>";
    build += "<h4 class='align-center' style='color: #4CAF50;'>Seats available</h4>";
    build += "<div class='align-center'>";
    build += "<iframe width='300' height='300' frameborder='0' id='google-map' src='http://maps.google.co.uk?q=" + obj.dep + "&z=60&output=embed'></iframe>";
    build += "</div><hr>";
    build += "<h5 class='align-center' style='color: #4CAF50;'>Destination</h5>";
    build += "<h4 class='align-center'>" + obj.dest + "</h4><hr>";
    build += "<h5 class='align-center' style='color: #4CAF50;'>cost</h5>";
    build += "<h2 class='align-center'> GHC " + obj.cost + "</h2><hr>";

    build += "<div class='row'>";
    build += "<div class='col-xs-6'>";
    build += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button' onclick='get_all_pools()'><i style='font-size: 20px' class='zmdi zmdi-arrow-back'></i></a>";
    build += "</div>"
    build += "<div class='col-xs-6 align-right'>"
    build += "<a href='#' class='ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button' onclick='show_pop(" + obj.id + ")'><i style='20px' class='zmdi zmdi-close'></i></a>";
    //build += "<a href='#' style='background-color: gainsboro' class='ui-btn waves-effect waves-button waves-effect waves-button' onclick='leave_pool(" + obj.id + ")'><i style='font-size: 20px' class='zmdi zmdi-close'></i></a>";
    build += "</div>";

    $("#apool").html(build);

    change_page("#poolpage", "pop");

}

function close_pop() {
    $("#readytodelete").popup("close", {transition: "slide"});
}

function show_pop(pid) {
    //var url, obj, uid;

    global_pid = pid;
    //alert(global_pid);
    $("#readytodelete").popup("open", {transition: "slide"});
    //url = "./server-side/controller.php?cmd=9&pid=" + pid + "&uid=" + uid;
    //./server-side/controller.php?cmd=6&id=" + pid
}

function leave_pool() {

    close_pop();

    var url, obj;

    url = "./server-side/controller.php?cmd=9&pid=" + global_pid + "&uid=" + global_id;

    obj = send_request(url);

    if (obj.result == 1) {
        //alert("left");
        $("#leavedonepopup").popup("open", {transition: "slide"});
        //
        setTimeout(
            function () {
                change_page("#allpoolspage", "slide")
            }, 900);
    }
}




