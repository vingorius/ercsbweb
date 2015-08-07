var express = require('express');
var getConnection = require('./modules/mysql_connection');
var plot = require('./modules/plot');
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
		});
	});
});


router.get('/comutationplot2', function(req, res, next) {
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

			connection.query('CALL getComutationplotMutsig()', function(sig_err, sig_rows) {
				if (sig_err) throw sig_err;
				transfer_object.data.symbol_list = sig_rows[0];
				connection.query('CALL getComutationplotGroup()', function(grp_err, grp_rows) {
					if (grp_err) throw grp_err;

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

				connection.query('CALL getComutationplotTumorMutsig(?)', [p_type], function(sig_err, sig_rows) {
					if (sig_err) throw sig_err;
					transfer_object.data.symbol_list = sig_rows[0];
					transfer_object.data.group_list = ['group'];
					res.json(transfer_object);
				});
			});
		});

	});
});

router.get('/comutationplot', function(req, res, next) {
	var p_cancer_type = req.query.cancer_type;
	var p_sample_id = req.query.sample_id;

	var transfer_object = {
		status: 0,
		message: 'OK',
		data: {
			id: 'id',
			name: 'Co Mutation Plot with TCGA',
			type: p_cancer_type.toUpperCase(),
			mutation_list: [],
			gene_list: [],
			group_list: [],
			patient_list: [],
		}
	};

	getConnection(function(connection) {
		connection.query('CALL omics_data.getComutationplotMutationList(?)', [p_cancer_type], function(mut_err, mut_rows) {
			if (mut_err) throw mut_err;
			transfer_object.data.mutation_list = mut_rows[0];

			connection.query('CALL omics_data.getComutationplotMutationGeneList(?)', [p_cancer_type], function(sig_err, sig_rows) {
				if (sig_err) throw sig_err;
				transfer_object.data.gene_list = sig_rows[0];
				connection.query('CALL omics_data.getComutationplotMutationGroupList(?)', [p_cancer_type], function(group_err, group_rows) {
					if (group_err) throw group_err;
					var his_group = {
						name: 'histological_type',
						data: []
					};
					var gender_group = {
						name: 'gender',
						data: []
					};

					group_rows[0].forEach(function(_data) {
						his_group.data.push({
							'sample': _data.sample_id,
							'value': _data.histological_type
						});
						gender_group.data.push({
							'sample': _data.sample_id,
							'value': _data.gender
						});
					});
					transfer_object.data.group_list.push(his_group);
					transfer_object.data.group_list.push(gender_group);

					connection.query('CALL omics_data.getComutationplotMutationPatientList(?,?)', [p_cancer_type, p_sample_id], function(patient_err, patient_rows) {
						if (patient_err) throw patient_err;
						transfer_object.data.patient_list = patient_rows[0];

						res.json(transfer_object);
					});
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
	var cancer_type = req.query.cancer_type;
	var sample_id = req.query.sample_id;
	var gene = req.query.gene;
	var transcript = req.query.transcript;

	var transfer_object = {
		status: 0,
		message: 'OK',
		data: {
			name: gene,
			title: cancer_type.toUpperCase() + ': ' + gene + ',' + transcript,
			x_axis_title: 'aa',
			y_axis_title: '# Mutations',
			public_list: [],
			patient_list: [],
			graph: {},
		}
	};

	getConnection(function(connection) {
		connection.query('CALL omics_data.getNeedleplotPublicList(?,?,?)', [cancer_type, gene, transcript], function(err, rows) {
			if (err) throw err;
			transfer_object.data.public_list = rows[0];
			connection.query('CALL omics_data.getNeedleploPatientList(?,?,?,?)', [cancer_type, sample_id, gene, transcript], function(p_err, p_rows) {
				if (p_err) throw p_err;
				transfer_object.data.patient_list = p_rows[0];
				connection.query('CALL omics_data.getNeedleplotGraph(?)', [gene], function(g_err, g_rows) {
					if (g_err) throw g_err;
					var graph = JSON.parse(g_rows[0][0].json_data);
					transfer_object.data.graph = graph;
					res.json(transfer_object);
				});
			});
		});
	});

});

router.get('/needleplot_old', function(req, res, next) {
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
	if (gene === undefined) {
		transfer_object.status = 1000;
		transfer_object.message = 'No parameter';
		res.json(transfer_object);
		return;
	}
	getConnection(function(connection) {
		connection.query('CALL `needleplot.aachange`(?)', [gene], function(err, rows) {
			if (err) throw err;

			if (rows[0].length === 0) {
				transfer_object.status = 1001;
				transfer_object.message = 'No Data Found';
				res.json(transfer_object);
				return;
			}
			transfer_object.data.sample_list = rows[0];
			//    res.json(transfer_object);
			connection.query('CALL `needleplot.graph`(?)', [gene], function(g_err, g_rows) {
				if (g_err) throw g_err;
				if (g_rows[0].length === 0) {
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
	var transfer_object = {
		status: 0,
		message: 'OK',
		data: {
			pathwayList: []
		}
	};

	getConnection(function(connection) {
		connection.query('CALL getDEGpathway()', function(err, rows) {
			if (err) throw err;
			transfer_object.data.pathway_list = rows[0];
			res.json(transfer_object);
		});
	});


});


module.exports = router;
