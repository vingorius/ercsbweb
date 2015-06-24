var express = require('express');
var pool = require('./modules/mysql_connection');
var session = require('express-session')

var router = express.Router();

router.post('/login', function(req, res, next) {
    if(!req.session.user){
        console.log('세션에 사용자가 없다');
    }else{
        console.log('세션에 사용자가 있다',req.session.user);
    }
    var transfer_object = {
        status: -1,
        message: 'Error',
        user: {}
    };

    if (req.body == undefined || req.body.userid == undefined || req.body.password == undefined) {
        transfer_object.status = 100;
        transfer_object.message = 'EPARAM';
        res.json(transfer_object);
        return next;
    }

    var userid = req.body.userid;
    var password = req.body.password;

    pool.getConnection(function(err, connection) {
        connection.query('CALL login(?,?)', [userid, password], function(err, rows, fields) {
            if (err) throw err;
            var data = rows[0][0];
            transfer_object.status  = data.status;
            transfer_object.message = data.message;
            transfer_object.user.userid = data.userid;
            transfer_object.user.group  = data.group;

            console.log("Query Data:",rows[0]);

            if(data.status == 0){
                req.session.user = {userid:data.userid,group:data.group};
                console.log("Success",req.session.user);
            }else{
                req.session.destroy();
            }

            res.json(transfer_object);
            //console.log('The solution is: ', rows[0].solution);
            connection.release();
        });
    });


    //res.json(transfer_object);
    // pool.getConnection(function(err, connection) {
    //     connection.query('CALL getMAPlot()', function(err, rows, fields) {
    //         if (err) throw err;
    //         transfer_object.data.plot_list = rows[0];
    //         res.json(transfer_object);
    //         //console.log('The solution is: ', rows[0].solution);
    //         connection.release();
    //     });
    // });
});

module.exports = router;
