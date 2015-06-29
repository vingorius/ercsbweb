var express = require('express');
var passport = require('passport');
var router = express.Router();
var authorization = require('express-authorization');

/* GET users listing. */
router.get('/menu0',function(req, res, next) {
    res.render('menus/menu0', {
        user: req.user
    });
});
router.get('/menu1', function(req, res, next) {
    res.render('menus/menu1', {
        user: req.user
    });
});
router.get('/menu2', function(req, res, next) {
    res.render('menus/menu2', {
        user: req.user
    });
});

module.exports = router;
