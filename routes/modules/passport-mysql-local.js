// config/passport.js
// load all the things we need
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var pool = require('./mysql_connection');

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
                if(!validator.isEmail(username)){
                    return done(null, false, req.flash('signupMessage', 'Please insert a valid E-mail address.'));
                }
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                pool.getConnection(function(err, connection) {
                    connection.query("SELECT * FROM users WHERE username = ?", [username], function(err, rows) {
                        if (err)
                            return done(err);
                        if (rows.length) {
                            return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                        } else {
                            // if there is no user with that username
                            // create the user
                            var newUserMysql = {
                                username: username,
                                password: bcrypt.hashSync(password, null, null) // use the generateHash function in our user model
                            };

                            var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";

                            connection.query(insertQuery, [newUserMysql.username, newUserMysql.password], function(err, rows) {
                                newUserMysql.id = rows.insertId;
                                return done(null, newUserMysql);
                            });
                        }
                    });
                });
            })
    );

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
                pool.getConnection(function(err, connection) {
                    connection.query("SELECT * FROM users WHERE username = ?", [username], function(err, rows) {
                        if (err)
                            return done(err);
                        if (!rows.length) {
                            return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                        }

                        // if the user is found but the password is wrong
                        if (!bcrypt.compareSync(password, rows[0].password))
                            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                        // all is well, return successful user
                        //rows[0].permissions =  ["admin:*"];
                        // get permissions
                        connection.query("SELECT permission FROM users_permissions WHERE username = ?", [username], function(err, p_rows) {
                            if (err)
                                return done(err);
                            if (p_rows.length > 0) {
                                rows[0].permissions = [];
                                p_rows.map(function(data){
                                    rows[0].permissions.push(data.permission);
                                });
                            }
                            return done(null, rows[0]);
                        });
                    });
                });
            })
    );
};
