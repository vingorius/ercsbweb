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
    console.log(req.body);

    var colname = req.body.name;
    var colvalue = req.body.value;
    var pk = req.body.pk;

    if (!pk || pk == 'undefined') {
        res.status(400).send('ERRPK:Something wrong!!!');
        return;
    }
    console.log('hi');
    getConnection(function(connection) {
        connection.query('update ercsb_cdss.users set ?? = ? where id = ?', [colname, colvalue, pk], function(err, rows) {
            if (err) throw err;
            res.json({
                message: 'updated!!!'
            });
        });
    });
});

module.exports = router;
