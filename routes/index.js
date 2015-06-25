var express = require('express');
var passport = require('passport');
var Account = require('./account');
var router = express.Router();

//
router.get('/', function(req, res) {
    console.log("Login User", req.user)
    res.render('index', {
        user: req.user
    });
});

router.get('/register', function(req, res) {
    res.render('system/register', {message: req.flash('signupMessage')});
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
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}), function(req, res) {
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
