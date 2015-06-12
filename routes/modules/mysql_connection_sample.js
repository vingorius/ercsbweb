var mysql = require('mysql');

//var connection = mysql.createConnection({
var pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    database: 'yourdatabase',
    user: 'uesr',
    password: 'password'
});

module.exports = pool;
