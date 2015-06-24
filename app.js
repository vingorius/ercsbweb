var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session')

var routes = require('./routes/index');
var users = require('./routes/users');
// Login,Logout Manager
var manager = require('./routes/manager');

// Chart view
var chart = require('./routes/chart');
// Chart RESTful Service
var maplot = require('./routes/maplot');
var needleplot = require('./routes/needleplot');
var xyplot = require('./routes/xyplot');

var app = express();
// Session Management
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// For contents gzip compression
app.use(compression())
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/manager', manager);
// Chart view
app.use('/users', users);
app.use('/chart', chart);
// Chart RESTful Service
app.use('/maplot', maplot);
app.use('/needleplot', needleplot);
app.use('/xyplot', xyplot);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
    message: err.message,
    error: {}
  });
});


module.exports = app;
