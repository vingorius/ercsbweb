var express = require('express');
var getConnection = require('./modules/mysql_connection');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('chart/index', {
        title: 'Express'
    });
});

// For Test
router.get('/sleep3', function(req, res, next) {
    setTimeout(function() {
        res.send('sleep 3s');
        res.end();
    }, 3000);
});


// For Test
router.get('/delay3', function(req, res, next) {
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
    getConnection(function(connection) {
        connection.query('select sleep(5)', function(err, rows) {
            if (err) throw err;
            transfer_object.data.plot_list = rows[0];
            res.json(transfer_object);
        })
    });
});


router.get('/comutationplot', function(req, res, next) {
    var transfer_object = {
        status: 0,
        message: 'OK',
        data: {
            id: '2',
            name: 'Lung Cancer',
            type: 'LUCA',
            sample_list: [],
            symbol_list: [],
            group_list: []
        }
    };
    getConnection(function(connection) {
        connection.query('CALL getComutationplotMutation()', function(mut_err, mut_rows) {
            if (mut_err) throw mut_err;
            //transfer_object.data.sample_list = mut_rows[0];
            var sample_list = [];
            for (i = 0; i < mut_rows[0].length; i++) {
                var data = mut_rows[0][i];
                var samples = sample_list.filter(function(obj) {
                    return obj.name == data.sample;
                });
                var sample;
                if (samples.length == 0) {
                    sample = {
                        id: "id",
                        name: data.sample,
                        group: data.group,
                        gene_list: []
                    };
                    var gene = {
                        name: data.hugo,
                        aberration_list: []
                    };
                    var aberration = {
                        type: data.type,
                        value: data.value
                    };
                    gene.aberration_list.push(aberration);
                    sample.gene_list.push(gene)
                    sample_list.push(sample);
                } else {
                    sample = samples[0];
                    var genes = sample.gene_list.filter(function(obj) {
                        return obj.name == data.hugo;
                    });
                    var gene;
                    var aberration = {
                        type: data.type,
                        value: data.value
                    };
                    if (genes.length == 0) {
                        gene = {
                            name: data.hugo,
                            aberration_list: []
                        };
                        sample.gene_list.push(gene);
                    } else {
                        gene = genes[0];
                    }
                    gene.aberration_list.push(aberration);
                }

            }
            transfer_object.data.sample_list = sample_list;
            //console.log(transfer_object.data.sample_list[5]);

            connection.query('CALL getComutationplotMutsig()', function(sig_err, sig_rows) {
                if (sig_err) throw sig_err;
                transfer_object.data.symbol_list = sig_rows[0];
                connection.query('CALL getComutationplotGroup()', function(grp_err, grp_rows) {
                    if (grp_err) throw grp_err;
                    grp_rows[0].map(function(data) {
                        transfer_object.data.group_list.push(data.group);
                    });

                    res.json(transfer_object);
                });
            });
        });
    });
});

router.get('/tumorportal_cmp', function(req, res, next) {
    var p_type = req.query.type || 'BRCA';
    var transfer_object = {
        status: 0,
        message: 'OK',
        data: {
            id: 'id',
            name: 'TumorPortal Cancer Type: BRCA',
            type: 'LUCA',
            sample_list: [],
            symbol_list: [],
            group_list: []
        }
    };
    getConnection(function(connection) {
        connection.query('select SaveSortedPatientListIfNot(?)', [p_type], function(err, rows) {
            if (err) throw err;

            connection.query('CALL getComutationplotTumorMutation(?)', [p_type], function(mut_err, mut_rows) {
                if (mut_err) throw mut_err;
                //transfer_object.data.sample_list = mut_rows[0];
                var sample_list = [];
                for (i = 0; i < mut_rows[0].length; i++) {
                    var data = mut_rows[0][i];
                    var samples = sample_list.filter(function(obj) {
                        return obj.name == data.sample;
                    });
                    var sample;
                    if (samples.length == 0) {
                        sample = {
                            id: "id",
                            name: data.sample,
                            group: data.group,
                            gene_list: []
                        };
                        var gene = {
                            name: data.hugo,
                            aberration_list: []
                        };
                        var aberration = {
                            type: data.type,
                            value: data.value
                        };
                        gene.aberration_list.push(aberration);
                        sample.gene_list.push(gene)
                        sample_list.push(sample);
                    } else {
                        sample = samples[0];
                        var genes = sample.gene_list.filter(function(obj) {
                            return obj.name == data.hugo;
                        });
                        var gene;
                        var aberration = {
                            type: data.type,
                            value: data.value
                        };
                        if (genes.length == 0) {
                            gene = {
                                name: data.hugo,
                                aberration_list: []
                            };
                            sample.gene_list.push(gene);
                        } else {
                            gene = genes[0];
                        }
                        gene.aberration_list.push(aberration);
                    }

                }
                transfer_object.data.sample_list = sample_list;
                //console.log(transfer_object.data.sample_list[5]);

                connection.query('CALL getComutationplotTumorMutsig(?)', [p_type], function(sig_err, sig_rows) {
                    if (sig_err) throw sig_err;
                    transfer_object.data.symbol_list = sig_rows[0];
                    // connection.query('CALL getComutationplotTumorGroup()', function(grp_err, grp_rows) {
                    //     if (grp_err) throw grp_err;
                    //     grp_rows[0].map(function(data) {
                    //         transfer_object.data.group_list.push(data.group);
                    //     });
                    // });
                    transfer_object.data.group_list = ['group'];
                    res.json(transfer_object);
                });
            });
        });

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
    getConnection(function(connection) {
        connection.query('CALL getMAPlot()', function(err, rows) {
            if (err) throw err;
            transfer_object.data.plot_list = rows[0];
            res.json(transfer_object);
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
    getConnection(function(connection) {
        connection.query('CALL `needleplot.aachange`(?)', [gene], function(err, rows) {
            if (err) throw err;

            if (rows[0].length == 0) {
                transfer_object.status = 1001;
                transfer_object.message = 'No Data Found';
                res.json(transfer_object);
                return;
            }
            transfer_object.data.sample_list = rows[0];
            //    res.json(transfer_object);
            connection.query('CALL `needleplot.graph`(?)', [gene], function(g_err, g_rows) {
                if (g_err) throw g_err;
                if (g_rows[0].length == 0) {
                    transfer_object.status = 1001;
                    transfer_object.message = 'No Data Found';
                    res.json(transfer_object);
                    return;
                }

                var graph = JSON.parse(g_rows[0][0].json_data);
                transfer_object.data.graph = graph;
                res.json(transfer_object);
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
    getConnection(function(connection) {
        connection.query('CALL getXYPlot()', function(err, rows) {
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
