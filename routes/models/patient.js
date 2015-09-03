var express = require('express');
var getConnection = require('../modules/mysql_connection');
var router = express.Router();

router.get('/getSampleVariantList', function(req, res, next) {
	var cancer_type = req.query.cancer_type;
	var sample_id = req.query.sample_id;
	// console.log(sample_id,cancer_type);
	getConnection(function(connection) {
		connection.query('CALL omics_data.getNeedleplotPatientVariantList(?,?)', [cancer_type, sample_id], function(err, rows) {
			if (err) throw err;
			rows[0].forEach(function(_data) {
				var d = JSON.parse(_data.pdomain_json);
				//console.log(d[0].regions);
				var domain = getDomain(d[0].regions, _data.pos);
				_data.pdomain = domain.id;
				_data.pdomain_desc = domain.desc;
			});

			res.json(rows[0]);
		});
	});
});

/*
 * Needleplot을 그리기 위해 있는 json data에서 해당 위치가 어떤 도메인인지 json에서 찾아서 리턴한다.
 * 이 값을 personal_variants_summary1 테이블을 생성할 때 집어 넣으면 좋지만, mysql에서 json 핸들링하기가 쉽지않아,
 * 여기에 만들었다.
 */
var getDomain = function(regions, pos) {
	//console.log(pos,regions);
	var domain = {
		id: '',
		desc: ''
	};

	for(var i =0; i < regions.length;i++){
		if (Number(pos) >= Number(regions[i].metadata.start) && Number(pos) <= Number(regions[i].metadata.end)) {
			domain.id = regions[i].metadata.identifier;
			domain.desc = regions[i].metadata.description;
			return domain;
		}
	}
	return domain;
};

router.get('/getSampleList', function(req, res, next) {
	getConnection(function(connection) {
		connection.query('CALL omics_data.getPageTestSampleList()', function(err, rows) {
			if (err) throw err;
			res.json(rows[0]);
		});
	});
});

module.exports = router;
