var express = require('express');
var pool = require('./modules/mysql_connection');

var router = express.Router();

router.get('/', function(req, res, next) {
    var transfer_object = {
        status: 0,
        message: 'OK',
        data: {
            title: 'MA Plot',
            x_axis_title: 'AveExpr',
            y_axis_title: 'LogFC',
            cutoff_value: 0.01,
            plot_list: []
        }
    };
    pool.query('CALL getMAPlot()', function(err, rows, fields) {
        if (err) throw err;
        transfer_object.data.plot_list = rows[0];
        res.json(transfer_object);
        //console.log('The solution is: ', rows[0].solution);
    });
});

module.exports = router;
