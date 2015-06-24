$(document).ready(function() {
    //On click Event on Login Button
    $('#loginButton').on('click', function() {
        login({
            userid: $('#userid').val(),
            password: $('#password').val()
        });
    });
    $('#logoutButton').on('click', function() {
        alert('logout');
    });
});

var login = function(user) {
    console.log(user);
    $.ajax({
        url: "/manager/login",
        method: "POST",
        data: {
            userid: user.userid,
            password: user.password
        },
        success: function(data) {
            if (data.status == 0) {
                console.log(data);
                $("#loginMessage").html(data.message);
            } else {
                console.log(data);
                $("#loginMessage").html(data.message);
            }
            //$("#weather-temp").html("<strong>" + data + "</strong> degrees");
        }
    });
}

var logout = function() {
    $.ajax({
        url: "/manager/logout",
        method: "POST",
        data: {},
        success: function(data) {
            if (data.status == 0) {
                console.log('Success',data);
            } else {
                console.log('Error',data);
            }
            //$("#weather-temp").html("<strong>" + data + "</strong> degrees");
        }
    });
}
