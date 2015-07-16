// config/passport.js
// load all the things we need
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
//var pool = require('./mysql_connection');
var getConnection = require('./mysql_connection');

// load up the user model
//var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
//var dbconfig = require('./database');
//var connection = mysql.createConnection(dbconfig.connection);

//connection.query('USE userdb');// + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        //'local-signup',
        'register',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {
                // Check Your name is valid email format
                req.flash('prev', getUserFromInputData(req));
                //console.log('username',req.body.username);
                if (!validator.isEmail(username)) {
                    return done(null, false, req.flash('signupMessage', 'Please insert a valid E-mail address.'));
                }
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                getConnection(function(connection) {
                    //connection.query("SELECT * FROM users WHERE username = ?", [username], function(err, rows) {
                    connection.query("call ercsb_cdss.getUserByName(?)", [username], function(err, rows, fields) {
                        if (err)
                            return done(err);

                        if (rows[0].length) {
                            return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                        } else {
                            // if there is no user with that username
                            // create the user
                            var newUserMysql = {
                                username: username,
                                password: bcrypt.hashSync(password, null, null) // use the generateHash function in our user model
                            };
                            //console.log(req.body);
                            //var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";
                            var insertQuery = 'call ercsb_cdss.insertUser(?,?,?,?,?,?,?,?,?,?)';
                            connection.query(insertQuery, [newUserMysql.username,
                                    newUserMysql.password,
                                    req.body.fullname,
                                    req.body.birth,
                                    req.body.gender,
                                    req.body.mobile,
                                    req.body.country,
                                    req.body.company_name,
                                    req.body.company_address,
                                    req.body.company_position
                                ],
                                function(err, rows, fields) {
                                    if (err) return done(err);

                                    newUserMysql.id = rows.insertId;
                                    return done(null, newUserMysql);
                                });
                        }
                    });
                });
            })
    );

    var getUserFromInputData = function(req) {
        return req.body;
    };

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        //'local-login',
        'login',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) { // callback with email and password from our form
                getConnection(function(connection) {
                    connection.query("call ercsb_cdss.getUserByName(?)", [username], function(err, rows, fields) {
                        if (err)
                            return done(err);
                        var user = rows[0][0]; //Only One Rows
                        //console.log(user);
                        if (typeof user === 'undefined') {
                            return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                        }

                        // if the user is found but the password is wrong
                        if (!bcrypt.compareSync(password, user.password))
                            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                        // all is well, return successful user
                        //rows[0].permissions =  ["admin:*"];
                        // get permissions
                        // connection.query("call ercsb_cdss.getPermissionsByUserName(?)", [username], function(p_err, p_rows, p_fields) {
                        //     if (p_err)
                        //         return done(p_err);
                        //     var permissions = p_rows[0];
                        //     //console.log(permissions);
                        //     if (typeof permissions != 'undefined') {
                        //         user.permissions = [];
                        //         permissions.map(function(data) {
                        //             user.permissions.push(data.permission);
                        //         });
                        //     }
                        //     //console.log(user);
                        //     return done(null, user);
                        // });
                        return done(null, user);
                    });
                });
            })
    );
};
