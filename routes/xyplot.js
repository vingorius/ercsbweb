var express = require('express');
var pool = require('./modules/mysql_connection');

var router = express.Router();

router.get('/', function(req, res, next) {
    var gene = req.query.gene;
    var transfer_object = {
        status: 0,
        message: 'OK',
        data: {
            title: 'DrGap Plot',
            x_axis: {title:'log(mutation rate)',start:0.1,end:0.1},
            y_axis: {title:'-log(p-value)',start:0.1,end:0.1},
            plot_list: []
        }
    };
    pool.query('CALL getXYPlot()',function(err, rows, fields) {
        if (err) throw err;
        transfer_object.data.plot_list = rows[0];

        var obj = getMaxMin(transfer_object.data.plot_list);

        transfer_object.data.x_axis.start = obj.x.min;
        transfer_object.data.x_axis.end = obj.x.max;
        transfer_object.data.y_axis.start = obj.y.min;
        transfer_object.data.y_axis.end = obj.y.max;

        res.json(transfer_object);
    });
});

var sort_func = function(a,b){
    return (a < b) ? -1 : 1;
}

/*
 * x축 start, end .y축 start, end를 구하는 함수.
 * 리스트를 소팅하여 시작과 끝 값을 min, max로 구한다.
 */
var getMaxMin = function(plot_list){
    var xlist = [];
    var ylist = [];

    plot_list.map(function(_d,_i){
        xlist[_i] = Number(_d.x);
        ylist[_i] = Number(_d.y);
    });
    xlist.sort(sort_func);
    ylist.sort(sort_func);
    return {
        x : {
            min : xlist[0],
            max : xlist[xlist.length-1]
        },
        y : {
            min : ylist[0],
            max : ylist[ylist.length-1]
        }
    }
}

module.exports = router;
