var express = require('express');
var pool = require('./modules/mysql_connection');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('chart/index', {
        title: 'Express'
    });
});

router.get('/maplot', function(req, res, next) {
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
    pool.getConnection(function(err, connection) {
        connection.query('CALL getMAPlot()', function(err, rows, fields) {
            if (err) throw err;
            transfer_object.data.plot_list = rows[0];
            res.json(transfer_object);
            //console.log('The solution is: ', rows[0].solution);
            connection.release();
        });
    });
});
router.get('/needleplot', function(req, res, next) {
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
    pool.getConnection(function(err, connection) {

        connection.query('CALL `needleplot.aachange`(?)', [gene], function(err, rows, fields) {
            if (err) throw err;

            if (rows[0].length == 0) {
                transfer_object.status = 1001;
                transfer_object.message = 'No Data Found';
                res.json(transfer_object);
                connection.release();
                return;
            }
            transfer_object.data.sample_list = rows[0];
            //    res.json(transfer_object);
            connection.query('CALL `needleplot.graph`(?)', [gene], function(g_err, g_rows, g_fields) {
                if (g_err) throw g_err;
                if (g_rows[0].length == 0) {
                    transfer_object.status = 1001;
                    transfer_object.message = 'No Data Found';
                    res.json(transfer_object);
                    connection.release();
                    return;
                }

                var graph = JSON.parse(g_rows[0][0].json_data);
                transfer_object.data.graph = graph;
                res.json(transfer_object);
                connection.release();
            });
        });
    });
});

router.get('/xyplot', function(req, res, next) {
    var gene = req.query.gene;
    var transfer_object = {
        status: 0,
        message: 'OK',
        data: {
            title: 'DrGap Plot',
            x_axis: {
                title: 'log(mutation rate)',
                start: 0.1,
                end: 0.1
            },
            y_axis: {
                title: '-log(p-value)',
                start: 0.1,
                end: 0.1
            },
            plot_list: []
        }
    };
    pool.getConnection(function(err, connection) {
        connection.query('CALL getXYPlot()', function(err, rows, fields) {
            if (err) throw err;
            transfer_object.data.plot_list = rows[0];

            var obj = getMaxMin(transfer_object.data.plot_list);

            transfer_object.data.x_axis.start = obj.x.min;
            transfer_object.data.x_axis.end = obj.x.max;
            transfer_object.data.y_axis.start = obj.y.min;
            transfer_object.data.y_axis.end = obj.y.max;

            res.json(transfer_object);
            connection.release();
        });
    });
});

var sort_func = function(a, b) {
    return (a < b) ? -1 : 1;
}

/*
 * x축 start, end .y축 start, end를 구하는 함수.
 * 리스트를 소팅하여 시작과 끝 값을 min, max로 구한다.
 */
var getMaxMin = function(plot_list) {
    var xlist = [];
    var ylist = [];

    plot_list.map(function(_d, _i) {
        xlist[_i] = Number(_d.x);
        ylist[_i] = Number(_d.y);
    });
    xlist.sort(sort_func);
    ylist.sort(sort_func);
    return {
        x: {
            min: xlist[0],
            max: xlist[xlist.length - 1]
        },
        y: {
            min: ylist[0],
            max: ylist[ylist.length - 1]
        }
    }
}
router.get('/degplot', function(req, res, next) {
    res.render('chart/degplot', {
        title: 'DEG Pathway Table',
        data: {
            titles: ["Title", "Title", "Title", "Title", "Title", "Title"],
            columns: [
                ["Data", "Data", "Data", "Data", "Data", "Data"],
                ["Data", "Data", "Data", "Data", "Data", "Data"],
                ["Data", "Data", "Data", "Data", "Data", "Data"],
                ["Data", "Data", "Data", "Data", "Data", "Data"],
                ["Data", "Data", "Data", "Data", "Data", "Data"]
            ]
        }
    });
});

module.exports = router;
