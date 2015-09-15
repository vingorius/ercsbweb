var express = require('express');
var getConnection = require('../modules/mysql_connection');
var router = express.Router();

router.get('/getSampleVariantList', function(req, res, next) {
	var cancer_type = req.query.cancer_type;
	var sample_id = req.query.sample_id;
	var frequency = req.query.frequency;
	var classification = req.query.classification;
	var cosmic = req.query.cosmic;
	var bg_count = req.query.bg_count;

	console.log(req.query);
	//var checkeditems = req.session.checkeditems; // Global Backgroud Patitent Data

	console.log(req.query);
	if (cancer_type === undefined || sample_id === undefined || frequency === undefined ||bg_count === undefined || classification === undefined || cosmic === undefined) {
		return res.status(400).send('Not sufficient paramerters');
	}

	getConnection(function(connection) {
		var params = [cancer_type, sample_id, classification, cosmic];
		connection.query('CALL omics_data.getPersonalVaiantsSummary(?,?,?,?)', params, function(err, rows) {
			if (err) throw err;
			var rvl = [];

			rows[0].forEach(function(_data) {
				// Frq.in.total이 조건 이상인 것으로 새로운 배열을 만든다.
				var frq = _data.patientsOfPosition/bg_count * 100;
				if(frq >= frequency){
					// 도메인을 잘라 넣는다.
					var arr = _data.pdomain_str.split('\t');
					if (arr.length > 0) {
						_data.pdomain = arr[0];
						_data.pdomain_desc = arr[1];
					}
					rvl.push(_data);
				}
			});
			res.json(rvl);
		});
	});
	// getConnection(function(connection) {
	// 	connection.query('CALL omics_data.getNeedleplotPatientVariantList(?,?)', [cancer_type, sample_id], function(err, rows) {
	// 		if (err) throw err;
	// 		rows[0].forEach(function(_data) {
	// 			var d = JSON.parse(_data.pdomain_json);
	// 			//console.log(d[0].regions);
	// 			var domain = getDomain(d[0].regions, _data.pos);
	// 			_data.pdomain = domain.id;
	// 			_data.pdomain_desc = domain.desc;
	// 		});
	//
	// 		res.json(rows[0]);
	// 	});
	// });
});

/*
 * Needleplot을 그리기 위해 있는 json data에서 해당 위치가 어떤 도메인인지 json에서 찾아서 리턴한다.
 * 이 값을 personal_variants_summary1 테이블을 생성할 때 집어 넣으면 좋지만, mysql에서 json 핸들링하기가 쉽지않아,
 * 여기에 만들었다.
 * 속도 문제로 Talbe로 빼내어 처리하였으므로, 더 이상 필요없음. 2015.09.08. Kim.J.H
 */
// var getDomain = function(regions, pos) {
// 	//console.log(pos,regions);
// 	var domain = {
// 		id: '',
// 		desc: ''
// 	};
//
// 	for (var i = 0; i < regions.length; i++) {
// 		if (Number(pos) >= Number(regions[i].metadata.start) && Number(pos) <= Number(regions[i].metadata.end)) {
// 			domain.id = regions[i].metadata.identifier;
// 			domain.desc = regions[i].metadata.description;
// 			return domain;
// 		}
// 	}
// 	return domain;
// };

router.get('/getSampleList', function(req, res, next) {
	getConnection(function(connection) {
		connection.query('CALL omics_data.getPageTestSampleList()', function(err, rows) {
			if (err) throw err;
			res.json(rows[0]);
		});
	});
});


// router.put('/bg_public', function(req, res, next) {
// 	console.log(req.body);
// 	var bg_public = {
// 		status: 'Fail',
// 		checkeditems: ''
// 	};
// 	var cancer_type = req.session.cancer_type;
// 	var checkeditems = req.body.checkeditems;
//
// 	if (checkeditems === undefined || cancer_type === undefined) {
// 		return res.json(bg_public);
// 	}
//
// 	getConnection(function(connection) {
// 		connection.query('select omics_data.countOfGDACByCancerType(?) as total', [cancer_type], function(err, rows) {
// 			if (err) throw err;
//
// 			var total_patient = rows[0].total;
//
// 			getConnection(function(connection) {
// 				connection.query('CALL omics_data.getPatientCountByFilter2(?,?)', [cancer_type, checkeditems], function(c_err, c_rows) {
// 					if (c_err) throw c_err;
//
// 					var checkeditems_cnt = c_rows[0][0].cnt;
// 					console.log('checkeditems_cnt', checkeditems_cnt);
//
// 					req.session.checkeditems = checkeditems;
// 					req.session.checkeditems_cnt = (checkeditems.trim() === '') ? total_patient : checkeditems_cnt;
// 					req.session.total_patient = total_patient;
//
// 					bg_public.status = 'OK';
// 					bg_public.checkeditems = req.session.checkeditems;
// 					bg_public.total_patient = req.session.total_patient;
// 					bg_public.checkeditems_cnt = req.session.checkeditems_cnt;
//
// 					res.json(bg_public);
// 				});
// 			});
// 		});
// 	});
//
// });

router.get('/bg_public', function(req, res, next) {
	//TODO cancer type별로 데이터를 가져오도록 만들어야 한다.
	var cancer_type = req.query.cancer_type;

	getConnection(function(connection) {
		connection.query('select * from omics_data.gdac_summary2', function(err, rows) {
			if (err) throw err;
			res.json(rows);
		});
	});

});


module.exports = router;
