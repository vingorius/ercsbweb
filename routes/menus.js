var express = require('express');
var passport = require('passport');
var router = express.Router();
var authorization = require('express-authorization');

router.use(function(req, res, next) {
    console.log('Path: ', req.path);
    next();
});

/* GET users listing. */
router.get('/menu0', function(req, res, next) {
    res.render('menus/menu0', {
        user: req.user
    });
});

router.get('/menu0/:page', function(req, res, next) {
    var page = req.params.page;
    page = 'menus/menu0/' + page;
    console.log(page);
    res.render(page, {
        user: req.user
    });
});

router.get('/menu1', function(req, res, next) {
    res.render('menus/menu1', {
        user: req.user
    });
});

router.get('/menu1/:page', function(req, res, next) {
    var page = req.params.page;
    page = 'menus/menu1/' + page;
    console.log(page);
    res.render(page, {
        user: req.user
    });
});



router.get('/menu2', function(req, res, next) {
    res.render('menus/menu2', {
        user: req.user
    });
});

router.get('/menu2/:page', function(req, res, next) {
    var page = req.params.page;
    page = 'menus/menu2/' + page;
    res.render(page, {
        user: req.user
    });
});

module.exports = router;
