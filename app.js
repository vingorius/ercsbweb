var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');

// Passport
var passport = require('passport');
var flash = require('connect-flash'); //Message 전달
require('./routes/modules/passport-mysql-local')(passport);

// Security
var security = require('./routes/modules/security');

//Session정보 저장
var session = require('express-session');
var MongoStore = require('connect-mongo')(session); //Session정보 저장
var options = require('./routes/modules/mongo-session-options.js'); //MongoDB Session Collection Information

var root = require('./routes/index');
//var admin = require('./routes/admin');
var menus = require('./routes/menus');

// Chart view
var chart = require('./routes/chart');
// Chart RESTful
var rest = require('./routes/rest');
// File Upload
var files = require('./routes/files');

// User Restful
var users = require('./routes/models/users');
// Patient Sample
var patient = require('./routes/models/patient');
// Drug Restful
var drug = require('./routes/models/drug');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'HEAD, GET, POST, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// Session Management
app.use(session({
    secret: 'keyboard cat',
    resave: true, //default
    saveUninitialized: true, //default
    store: new MongoStore(options)
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// For contents gzip compression
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// debug log user & session
if (app.get('env') === 'development') {
    app.use(logger('dev'));
    //app.use(security.debugLog);
    app.set('view options', {
        pretty: true
    });
}

// 모든 페이지에 user 객체를 넣어준다.
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

app.use('/', root);
//app.use('/admin', authorization.ensureRequest.isPermitted("admin:view"), admin);
//app.use('/admin', security.isAdmin, admin);
//상위메뉴차원에서 로그인한 세션만 접근할 수 있도록 하였다.
app.use('/menus', security.isAuthenticated, menus);
// Chart View
app.use('/chart', chart);
// Chart RESTful Service
app.use('/rest', rest);
// File Upload
app.use('/files', files);

// Users Restful
app.use('/models/users',security.isAuthenticated, users);
// Patient Sample
app.use('/models/patient', patient);
// Drug Restful
app.use('/models/drug', drug);

// catch 404 and forward to error handler
//여기까지 왔다는 말은 처리할 핸들러가 없다는 뜻.
app.use(function(req, res, next) {
    var err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            user: req.user, // For Menu whether login, logout
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        user: req.user, // For Menu whether login, logout
        message: err.message,
        error: {}
    });
});

module.exports = app;
