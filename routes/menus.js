var express = require('express');
var passport = require('passport');
var router = express.Router();

router.use(function(req, res, next) {
	// console.log('sample_id: ', req.query.sample_id);
	// console.log('cancer_type: ', req.query.cancer_type);
	if (req.query.sample_id !== undefined && req.query.cancer_type !== undefined) {
		req.session.sample_id = req.query.sample_id;
		req.session.cancer_type = req.query.cancer_type;
	}
	res.locals.sample = {
		id: req.session.sample_id,
		type: req.session.cancer_type
	};
	next();
});

router.get('/', function(req, res, next) {
	res.render('menus/index');
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
