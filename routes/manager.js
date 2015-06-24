var express = require('express');
var passport = require('passport');
var Account = require('./account');
var router = express.Router();


var router = express.Router();
//
router.get('/', function (req, res) {
    console.log("Manager root",req.user)
    res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    console.log("register",req.body)
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            console.log("register:err",err);
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
            console.log("register:redirect");
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
