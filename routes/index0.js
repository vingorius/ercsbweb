var express = require('express');
var router = express.Router();
var session = require('express-session')

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('index',req.user);
    res.render('index', { user : req.user });
});

module.exports = router;
