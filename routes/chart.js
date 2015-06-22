var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('chart/index', {
        title: 'Express'
    });
});

router.get('/maplot', function(req, res, next) {
    res.render('chart/maplot', {
        title: 'MaPlot'
    });
});

router.get('/degplot', function(req, res, next) {
    res.render('chart/degplot', {
        title: 'DEG Pathway Table',
        data: {
            titles: ["Title", "Title", "Title", "Title", "Title", "Title"],
            columns: [
                ["Data", "Data", "Data", "Data", "Data", "Data"],
                ["Data", "Data", "Data", "Data", "Data", "Data"],
                ["Data", "Data", "Data", "Data", "Data", "Data"],
                ["Data", "Data", "Data", "Data", "Data", "Data"]
            ]
        }
    });
});

module.exports = router;
