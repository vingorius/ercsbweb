var express = require('express');
var router = express.Router();
var session = require('express-session')

/* GET home page. */
router.get('/', function(req, res, next) {
    var data = {};
    data.user = {
        userid: '',
        group: ''
    };
    if (req.session.user) {
        data.user = req.session.user;
    }
    console.log(data);
    res.render('index', data);
});

module.exports = router;
