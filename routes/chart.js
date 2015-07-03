var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/maplot',function(req, res, next) {
    res.render('chart/maplot', {
        user: req.user
    });
});
router.get('/needleplot',function(req, res, next) {
    res.render('chart/needleplot', {
        user: req.user
    });
});
router.get('/xyplot',function(req, res, next) {
    res.render('chart/xyplot', {
        user: req.user
    });
});
router.get('/pcaplot',function(req, res, next) {
    res.render('chart/pcaplot', {
        user: req.user
    });
});
router.get('/comutationplot',function(req, res, next) {
    res.render('chart/comutationplot', {
        user: req.user
    });
});
module.exports = router;
