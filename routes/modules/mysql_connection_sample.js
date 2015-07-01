var mysql = require('mysql');

//var connection = mysql.createConnection({
// connection 개수는 cluster 개수가 max이다.
var pool = mysql.createPool({
    supportBigNumbers: true,
    connectionLimit: 100,
    // waitForConnections: false,
    host: 'localhost',
    database: 'yourdatabase',
    user: 'uesr',
    password: 'password'
});
pool.on('connection', function(connection) {
    console.log('connection is created!!!');
});
pool.on('enqueue', function() {
    console.log('Waiting for available connection slot');
});

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return err;
        }
        //console.log('connected as id ' + connection.threadId);

        callback(connection);
        connection.release();
    });
};
module.exports = getConnection;
