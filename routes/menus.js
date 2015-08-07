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
	res.locals.menu = {
		folder: req.params.folder,
		page: req.params.page
	};
	
	var loc = 'menus/' + req.params.folder + '/' + req.params.page;
	res.render(loc);
});

// router.get('/ngs/:page', function(req, res, next) {
//     var page = req.params.page;
//     page = 'menus/ngs/' + page;
//     res.render(page);
// });
//
// router.get('/analysis/:page', function(req, res, next) {
//     var page = req.params.page;
//     page = 'menus/analysis/' + page;
//     res.render(page);
// });
//
// router.get('/population/:page', function(req, res, next) {
//     var page = req.params.page;
//     page = 'menus/population/' + page;
//     res.render(page);
// });
//
module.exports = router;
