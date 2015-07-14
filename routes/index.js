var express = require('express');
var passport = require('passport');
//var Account = require('./account');
var router = express.Router();
var security = require('./modules/security');
//
router.get('/', function(req, res) {
    res.render('index', {
        user: req.user
    });
});

/* Information
 req.flash('key') 는 한번 호출되고 나면 내용을 삭제한다.
 따라서 값을 다른 변수에 저장하여야 한다.
 그리고  req.flash('key') 는 배열로 넘어온다.
 req.flash('prev') 사용자가 입력한 값이 들어 있다.
 req.body 값인데, redirect 되므로 req.body 값이 없어진다.
 따라서, flash에 이값을 저장하는데, flash는 session에 저장하나,
 한번 호출되고 나면 삭제하는 식으로 구현하였다.
 아울러 jade에서 이 값을 input 필드에 사용하려면 value=#{prev.username}처럼 쓰면
 값을 평가하기 때문에, 값이 없는 경우 undefined 가 들어간다.
 이런 경우 그냥 value=prev.username 로 사용하면 된다.
 참고 : http://stackoverflow.com/questions/921789/how-to-loop-through-javascript-object-literal-with-objects-as-members
 */
router.get('/register', function(req, res) {
    var prevArray = req.flash('prev');
    var prev = (prevArray.length > 0) ?prevArray[0] : {};

    //console.log('2',req.flash('prev'));
    res.render('system/register', {
        message: req.flash('signupMessage'),
        prev: prev
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
    // Admin인지 여부 체크, Admin 메뉴를 보여줄 지 여부 확인.
    req.user.isAdmin = security.isAdmin(req);
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
