var express = require('express');
var passport = require('passport');
var getConnection = require('./modules/mysql_connection');
var router = express.Router();

router.use(function(req, res, next) {
	console.log('menu: ', req.query);
	if (req.query.sample_id !== undefined && req.query.cancer_type !== undefined) {
		req.session.sample_id = req.query.sample_id;
		req.session.cancer_type = req.query.cancer_type;
	}

	res.locals.sample = {
		id: req.session.sample_id,
		type: req.session.cancer_type,
		// checkeditems: req.session.checkeditems,
		// checkeditems_cnt: req.session.checkeditems_cnt,
		// total_patient: req.session.total_patient,
	};
	next();
});

router.get('/', function(req, res, next) {
	res.render('menus/index');
});

router.get('/analysis/first', function(req, res, next) {
	// //환자 ID를 클릭하고 왔을 때는 모든 것의 시작이므로, 리셋함.
	// req.session.checkeditems = '';
	//
	// req.session.checkeditems_cnt = req.query.total_cnt;
	// req.session.total_patient = req.query.total_cnt;
	//
	// res.locals.sample.checkeditems_cnt = req.session.checkeditems_cnt;
	// res.locals.sample.total_patient = req.session.total_patient;

	//res.render('menus/analysis/summary');
	res.redirect('summary');
});

router.get('/:folder/:page', function(req, res, next) {
	//console.log(loc, res.locals.sample.id, res.locals.sample.type);
	// 사용자가 화면 주소를 복사하여 다른 브라우저를 열고 붙여넣기했을 때 이 값이 없이 들어올 수 있다.
	if (!res.locals.sample.id || !res.locals.sample.type)
		res.redirect('/menus');

	var loc = 'menus/' + req.params.folder + '/' + req.params.page;
	res.render(loc);
});

module.exports = router;
