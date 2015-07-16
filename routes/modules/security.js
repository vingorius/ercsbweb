var authorization = require('express-authorization');

var security = {};

security.debugLog = function(req, res, next) {
        if(req.user){
            console.log("Login User", req.user);
            if(req.session){
                console.log("Session", req.session);
            }
        }
        return next();
};
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
};

// security.isAdmin = function(req) {
//         //return authorization.considerSubject(req.user).isPermitted("admin:read");
//         console.log('group',req.user.group);
//         if(req.user.group === 'admin') return true;
//         return false;
// };

security.isAdmin = function(req, res, next) {
        if (req.user.isAdmin) {
            return next();
        }
        var err = new Error('Unauthorized!');
        err.status = 401;
        next(err);
};

// user,admin 두개로만 관리하기로 하였음.
// security.isPermitted = function(required_permission) {
//     return function(req, res, next) {
//         if (authorization.considerSubject(req.user).isPermitted(required_permission)) {
//             return next();
//         }
//         //res.redirect('/login');
//         var err = new Error('Unauthorized!');
//         err.status = 401;
//         next(err);
//     };
// };

module.exports = security;
