var express = require('express');
var mysql_connection = require('./modules/mysql_connection');

var router = express.Router();

router.get('/', function(req, res, next) {
    //connection.connect();
    var transfer_object = {
        status: 0,
        message: 'OK',
        data: {}
    };
    mysql_connection.query('CALL getMAPlot()', function(err, rows, fields) {
        if (err) throw err;
        transfer_object.plot_list = rows[0];
        res.json(transfer_object);
        //console.log('The solution is: ', rows[0].solution);
    });
    //connection.end();
});

module.exports = router;
