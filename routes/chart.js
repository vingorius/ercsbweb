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
module.exports = router;
