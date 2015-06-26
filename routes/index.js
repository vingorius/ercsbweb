var express = require('express');
var passport = require('passport');
var Account = require('./account');
var router = express.Router();

var authorization = require('express-authorization');

//
router.get('/', function(req, res) {
    console.log("Login User", req.user)
    res.render('index', {
        user: req.user
    });
});

router.get('/restricted', authorization.ensureRequest.isPermitted("admin:view"),
    function(req, res) {
        console.log("Login User", req.user)
        res.render('restricted', {
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
        req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
        req.session.cookie.expires = false;
    }
    //권한관리
    //req.user.permissions = ["admin:*"] ;
    //console.log("cookie",req.session.cookie);

    res.redirect('/');
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
