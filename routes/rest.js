var express = require('express');

var getConnection = require('./modules/mysql_connection');
var plot = require('./modules/plot');
var to = require('./modules/transfer_object');
var router = express.Router();


var isUndefined = function() {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] === undefined) return true;
    }
    return false;
};

router.get('/comutationplot', function(req, res, next) {
    var cancer_type = req.query.cancer_type;
    var sample_id = req.query.sample_id;
    var filter = req.query.filter;

    // if (cancer_type === undefined || sample_id === undefined || filter === undefined) {
    if (isUndefined(cancer_type, sample_id, filter)) {
        return res.json(to.noparameter());
    }

    var transfer_object = to.default();
    transfer_object.data = {
        id: 'id',
        name: 'Co Mutation Plot with TCGA',
        type: cancer_type.toUpperCase(),
        mutation_list: [],
        gene_list: [],
        group_list: [],
        patient_list: [],
    };

    getConnection(function(connection) {
        connection.query('CALL CGIS.sp_getComutationplotMutationList(?,?)', [cancer_type, filter], function(mut_err, mut_rows) {
            if (mut_err) return next(mut_err);
            transfer_object.data.mutation_list = mut_rows[0];

            connection.query('CALL CGIS.sp_getComutationplotMutationGeneList(?)', [cancer_type], function(sig_err, sig_rows) {
                if (sig_err) return next(sig_err);
                transfer_object.data.gene_list = sig_rows[0];
                connection.query('CALL CGIS.sp_getComutationplotMutationGroupList(?,?)', [cancer_type, filter], function(group_err, group_rows) {
                    if (group_err) return next(group_err);

                    var groupList = [];
                    var keys = Object.keys(group_rows[0][0]);
                    for (var i = 1; i < keys.length; i++) { // 0번은 sample_id 이므로 skip
                        //console.log(key);
                        groupList.push({
                            name: keys[i],
                            data: []
                        });
                    }
                    group_rows[0].forEach(function(_data) {
                        for (var i = 0; i < groupList.length; i++) {
                            groupList[i].data.push({
                                sample: _data.sample_id,
                                value: _data[groupList[i].name]
                            });
                        }
                    });
                    transfer_object.data.group_list = groupList;

                    connection.query('CALL CGIS.sp_getComutationplotMutationPatientList(?,?)', [cancer_type, sample_id], function(patient_err, patient_rows) {
                        if (patient_err) return next(patient_err);
                        transfer_object.data.patient_list = patient_rows[0];

                        res.json(transfer_object);
                    });
                });
            });
        });
    });
});

router.get('/comutationplotForERCSB', function(req, res, next) {
    var transfer_object = to.default();
    transfer_object.data = {
        id: 'id',
        name: 'Co Mutation Plot with TCGA + Lung104',
        type: 'LUAD',
        mutation_list: [],
        gene_list: [],
        group_list: [],
        patient_list: [],
    };

    getConnection(function(connection) {
        connection.query('CALL omics_data.getERCSBComutationplotMutationList()', function(mut_err, mut_rows) {
            if (mut_err) return next(mut_err);
            transfer_object.data.mutation_list = mut_rows[0];

            connection.query('CALL omics_data.getERCSBComutationplotMutationGeneList()', function(sig_err, sig_rows) {
                if (sig_err) return next(sig_err);
                transfer_object.data.gene_list = sig_rows[0];
                connection.query('CALL omics_data.getERCSBComutationplotMutationGroupList()', function(group_err, group_rows) {
                    if (group_err) return next(group_err);

                    var groupList = [];
                    var keys = Object.keys(group_rows[0][0]);
                    for (var i = 1; i < keys.length; i++) { // 0번은 sample_id 이므로 skip
                        //console.log(key);
                        groupList.push({
                            name: keys[i],
                            data: []
                        });
                    }
                    group_rows[0].forEach(function(_data) {
                        for (var i = 0; i < groupList.length; i++) {
                            groupList[i].data.push({
                                sample: _data.sample_id,
                                value: _data[groupList[i].name]
                            });
                        }
                    });
                    transfer_object.data.group_list = groupList;

                    // connection.query('CALL omics_data.getERCSBComutationplotMutationPatientList(?,?)', [p_cancer_type, p_sample_id], function(patient_err, patient_rows) {
                    // 	if (patient_err) return next(patient_err);
                    // 	transfer_object.data.patient_list = patient_rows[0];
                    //
                    // 	res.json(transfer_object);
                    // });
                    res.json(transfer_object);
                });
            });
        });
    });
});

router.get('/comutationplot2', function(req, res, next) {
    var transfer_object = to.default();
    transfer_object.data = {
        id: '2',
        name: 'Lung Cancer',
        type: 'LUCA',
        sample_list: [],
        symbol_list: [],
        group_list: []
    };
    getConnection(function(connection) {
        connection.query('CALL cbioportal.getComutationplotMutation()', function(mut_err, mut_rows) {
            if (mut_err) return next(mut_err);
            //transfer_object.data.sample_list = mut_rows[0];
            var sample_list = [];
            mut_rows[0].forEach(function(data) {
                var sample = plot.getSample(sample_list, data.sample);
                var aberration = plot.newAberration(data.type, data.value);

                if (sample === undefined) {
                    sample = plot.newSample('id', data.sample, data.group, []);
                    sample_list.push(sample);
                }
                var gene = plot.getGene(sample.gene_list, data.hugo);
                if (gene === undefined) {
                    gene = plot.newGene(data.hugo, []);
                    sample.gene_list.push(gene);
                }
                gene.aberration_list.push(aberration);

            });
            transfer_object.data.sample_list = sample_list;
            //console.log(transfer_object.data.sample_list[5]);

            connection.query('CALL cbioportal.getComutationplotMutsig()', function(sig_err, sig_rows) {
                if (sig_err) return next(sig_err);
                transfer_object.data.symbol_list = sig_rows[0];
                connection.query('CALL cbioportal.getComutationplotGroup()', function(grp_err, grp_rows) {
                    if (grp_err) return next(grp_err);

                    transfer_object.data.group_list =
                        grp_rows[0].map(function(data) {
                            return data.group;
                        });
                    res.json(transfer_object);
                });
            });
        });
    });
});

// Tumorportal 데이터를 가지고 그려봄.
router.get('/tumorportal_cmp', function(req, res, next) {
    var p_type = req.query.type || 'BRCA';
    var transfer_object = to.default();
    transfer_object.data = {
        id: 'id',
        name: 'TumorPortal Cancer Type: BRCA',
        type: 'LUCA',
        sample_list: [],
        symbol_list: [],
        group_list: []
    };
    getConnection(function(connection) {
        connection.query('select cbioportal.SaveSortedPatientListIfNot(?)', [p_type], function(err, rows) {
            if (err) return next(err);

            connection.query('CALL cbioportal.getComutationplotTumorMutation(?)', [p_type], function(mut_err, mut_rows) {
                if (mut_err) return next(mut_err);
                //transfer_object.data.sample_list = mut_rows[0];
                var sample_list = [];
                mut_rows[0].forEach(function(data) {
                    var sample = plot.getSample(sample_list, data.sample);
                    var aberration = plot.newAberration(data.type, data.value);

                    if (sample === undefined) {
                        sample = plot.newSample('id', data.sample, data.group, []);
                        sample_list.push(sample);
                    }
                    var gene = plot.getGene(sample.gene_list, data.hugo);
                    if (gene === undefined) {
                        gene = plot.newGene(data.hugo, []);
                        sample.gene_list.push(gene);
                    }
                    gene.aberration_list.push(aberration);

                });
                transfer_object.data.sample_list = sample_list;

                connection.query('CALL cbioportal.getComutationplotTumorMutsig(?)', [p_type], function(sig_err, sig_rows) {
                    if (sig_err) return next(sig_err);
                    transfer_object.data.symbol_list = sig_rows[0];
                    transfer_object.data.group_list = ['group'];
                    res.json(transfer_object);
                });
            });
        });

    });
});

router.get('/maplot', function(req, res, next) {
    var transfer_object = to.default();
    transfer_object.data = {
        title: 'MA Plot',
        x_axis_title: 'AveExpr',
        y_axis_title: 'LogFC',
        cutoff_value: 0.01,
        plot_list: []
    };
    getConnection(function(connection) {
        connection.query('CALL cbioportal.getMAPlot()', function(err, rows) {
            if (err) return next(err);
            transfer_object.data.plot_list = rows[0];
            res.json(transfer_object);
        });
    });
});


router.get('/needleplot', function(req, res, next) {
    var cancer_type = req.query.cancer_type;
    var sample_id = req.query.sample_id;
    var gene = req.query.gene;
    var transcript = req.query.transcript;
    var classification = req.query.classification;
    var filter = req.query.filter;

    // console.log(req.query);

    var transfer_object = to.default();

    // if (cancer_type === undefined || sample_id === undefined || gene === undefined || transcript === undefined || classification === undefined || filter === undefined) {
    if (isUndefined(cancer_type, sample_id, gene, transcript, classification, filter)) {
        return res.json(to.noparameter());
    }

    transfer_object.data = {
        name: gene,
        title: cancer_type.toUpperCase() + ': ' + gene + ',' + transcript,
        x_axis_title: 'aa',
        y_axis_title: '# Mutations',
        public_list: [],
        patient_list: [],
        graph: {},
    };

    getConnection(function(connection) {
        connection.query('CALL CGIS.sp_getNeedleplotPublicList(?,?,?,?,?)', [cancer_type, gene, transcript, classification, filter], function(err, rows) {
            if (err) return next(err);
            transfer_object.data.public_list = rows[0];
            connection.query('CALL CGIS.sp_getNeedleploPatientList(?,?,?,?,?)', [cancer_type, sample_id, gene, transcript, classification], function(p_err, p_rows) {
                if (p_err) return next(p_err);
                transfer_object.data.patient_list = p_rows[0];
                connection.query('CALL CGIS.sp_getNeedleplotGraph(?)', [gene], function(g_err, g_rows) {
                    if (g_err) return next(g_err);
                    transfer_object.data.graph = g_rows[0];
                    // console.log(g_rows[0].length);
                    // if (g_rows[0].length > 0) {
                    // 	var graph = JSON.parse(g_rows[0][0].json_data);
                    // 	transfer_object.data.graph = graph;
                    // }
                    res.json(transfer_object);
                });
            });
        });
    });

});

router.get('/pathwayplot', function(req, res, next) {
    var cancer_type = req.query.cancer_type;
    var sample_id = req.query.sample_id;
    // var seq = req.query.seq;
    var filter = req.query.filter;

    var transfer_object = to.default();

    // if (cancer_type === undefined || sample_id === undefined || seq === undefined || filter === undefined) {
    if (isUndefined(cancer_type, sample_id, filter)) {
        return res.json(to.noparameter());
    }

    transfer_object.data = {
        cancer_type: cancer_type,
        // seq: seq,
        pathway_list: [],
        gene_list: []
    };


    getConnection(function(connection) {
        connection.query('CALL CGIS.sp_getPathwayplot(?,?)', [cancer_type, filter], function(err, rows) {
            if (err) return next(err);
            transfer_object.data.pathway_list = rows[0];
            // res.json(transfer_object);
            connection.query('CALL CGIS.sp_getPathwayplotGeneList(?,?)', [cancer_type, sample_id], function(err, rows) {
                if (err) return next(err);
                transfer_object.data.gene_list = rows[0].map(function(_d) {
                    return _d.gene_id;
                });
                res.json(transfer_object);
            });
        });
    });
});


router.get('/needleplot_old', function(req, res, next) {
    var gene = req.query.gene;
    var transfer_object = to.default();
    transfer_object.data = {
        name: gene,
        graph: {},
        title: gene + ': [Somatic Mutation Rate: 0.8%]',
        x_axis_title: 'aa',
        y_axis_title: '# Mutations',
        sample_list: []
    };
    // if (gene === undefined) {
    if (isUndefined(gene)) {
        return res.json(to.noparameter());
    }
    getConnection(function(connection) {
        connection.query('CALL cbioportal.`needleplot.aachange`(?)', [gene], function(err, rows) {
            if (err) return next(err);

            if (rows[0].length === 0) {
                return res.json(to.nodatafound());
            }
            transfer_object.data.sample_list = rows[0];
            //    res.json(transfer_object);
            connection.query('CALL cbioportal.`needleplot.graph`(?)', [gene], function(g_err, g_rows) {
                if (g_err) return next(g_err);
                if (g_rows[0].length === 0) {
                    return res.json(to.nodatafound());
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
    var transfer_object = to.default();
    transfer_object.data = {
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
    };
    getConnection(function(connection) {
        connection.query('CALL cbioportal.getXYPlot()', function(err, rows) {
            if (err) return next(err);
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

router.get('/flowplot', function(req, res, next) {
    res.json("");
});

var sort_func = function(a, b) {
    return (a < b) ? -1 : 1;
};

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
    };
};

router.get('/degplot', function(req, res, next) {
    var transfer_object = to.default();

    getConnection(function(connection) {
        connection.query('CALL cbioportal.getDEGpathway()', function(err, rows) {
            if (err) return next(err);
            transfer_object.data = {};
            transfer_object.data.pathway_list = rows[0];
            res.json(transfer_object);
        });
    });
});

module.exports = router;
