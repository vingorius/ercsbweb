var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('chart/index', {
        title: 'Express'
    });
});

router.get('/maplot', function(req, res, next) {
    res.render('chart/maplot', {
        title: 'Express'
    });
});

module.exports = router;
