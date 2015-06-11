var mysql = require('mysql');

//var connection = mysql.createConnection({
var pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    database: 'cbioportal',
    user: 'root',
    password: 'ercsb123'
});

module.exports = pool;
