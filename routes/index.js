var express = require('express');
var passport = require('passport');
//var Account = require('./account');
var router = express.Router();

//
router.get('/', function(req, res) {
    res.render('index', {
        user: req.user
    });
});

router.get('/register', function(req, res) {
    res.render('system/register', {
        message: req.flash('signupMessage')
    });
});

router.post('/register', passport.authenticate('register', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/register', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

router.get('/login', function(req, res) {
    res.render('system/login', {
        user: req.user,
        message: req.flash('loginMessage')
    });
});

router.post('/login', passport.authenticate('login', {
    //successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}), function(req, res) {
    //Remember Me Cookie
    if (req.body.remember) {
        //24hours
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24;
    } else {
        req.session.cookie.expires = false;
    }
    // security.js에서 session에 넣어둔 원 path로 redirect한다.
    var origin = req.session.origin_path || '/';
    delete req.session.origin_path;

    res.redirect(origin);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
    //res.status(200).send("logout success");
});

router.get('/ping', function(req, res) {
    res.status(200).send("pong!");
});

module.exports = router;
