var express = require('express');
var router = express.Router();

router.get('/:page', function(req, res, next) {
	var page = 'chart/' + req.params.page;
	res.render(page);
});

module.exports = router;
