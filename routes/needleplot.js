var express = require('express');
var pool = require('./modules/mysql_connection');

var router = express.Router();

router.get('/', function(req, res, next) {
    var gene = req.query.gene;
    var transfer_object = {
        status: 0,
        message: 'OK',
        data: {
            name: gene,
            graph: {},
            title: gene + ': [Somatic Mutation Rate: 0.8%]',
            x_axis_title: 'aa',
            y_axis_title: '# Mutations',
            sample_list: []
        }
    };
    if (gene == undefined) {
        transfer_object.status = 1000;
        transfer_object.message = 'No parameter';
        res.json(transfer_object);
        return;
    }
    pool.query('CALL `needleplot.aachange`(?)', [gene], function(err, rows, fields) {
        if (err) throw err;
        if (rows[0].length == 0) {
            transfer_object.status = 1001;
            transfer_object.message = 'No Data Found';
            res.json(transfer_object);
            return;
        }
        transfer_object.data.sample_list = rows[0];
        //    res.json(transfer_object);
        pool.query('CALL `needleplot.graph`(?)', [gene], function(g_err, g_rows, g_fields) {
            if (g_err) throw g_err;
            var graph = JSON.parse(g_rows[0][0].json_data);
            transfer_object.data.graph = graph;
            res.json(transfer_object);
        });
    });
});

module.exports = router;
