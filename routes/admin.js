var express = require('express');
var router = express.Router();
var getConnection = require('./modules/mysql_connection');

router.get('/',
    function(req, res) {
        res.render('system/admin', {
            user: req.user,
            session: req.session
        });
    }
);

router.post('/users', function(req, res, next) {

    getConnection(function(connection) {
        connection.query('CALL ercsb_cdss.getUsers()', function(err, rows) {
            if (err) throw err;
            res.json(rows[0]);
        });
    });
});

router.put('/users', function(req, res, next) {
    var colname = req.body.name;
    var colvalue = req.body.value;
    var pk = req.body.pk;

    console.log(req.body);
    // Check Primary Key
    if (!pk || pk == 'undefined') return res.status(400).send('ERRPK:Bad Request!!!');

    getConnection(function(connection) {
        connection.query('update ercsb_cdss.users set ?? = ? where id = ?', [colname, colvalue, pk], function(err, rows) {
            // Check SQL Statement
            if (err) return res.status(500).send(err.code);
            // Check whether affected or not
            console.log(rows);
            if (rows.changedRows != 1) return res.status(500).send(rows.changedRows + ' rows affected.');

            // Finally Return
            res.json({
                message: 'Updated!'
            });
        });
    });
});

module.exports = router;
