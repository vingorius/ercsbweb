var authorization = require('express-authorization');

var security = {};

security.debugLog = function(req, res, next) {
        if(req.user){
            console.log("Login User", req.user);
            if(req.session){
                console.log("Session", req.session)
            }
        }
        return next();
}
security.isAuthenticated = function(req, res, next) {
    //로그인 여부 확인
    if (req.isAuthenticated()) {
        return next();
    }
    // origin_path 가 없을 때만 저장한다.
    //그래야 login을 실패하여 여러번 할 때도 원래를 찾아갈 수 있다.
    if (!req.session.origin_path) {
        req.session.origin_path = req.originalUrl;
    }
    res.redirect('/login');
}

security.isPermitted = function(required_permission) {
    return function(req, res, next) {
        if (authorization.considerSubject(req.user).isPermitted(required_permission)) {
            return next();
        }
        //res.redirect('/login');
        var err = new Error('not allowed!');
        err.status = 403;
        next(err);
    }
}
module.exports = security;
