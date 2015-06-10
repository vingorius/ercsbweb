var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'cbioportal',
    user: 'root',
    password: 'ercsb123'
});

module.exports = connection;
