var express = require('express');
var router = express.Router();
var security = require('../modules/security');
var getConnection = require('../modules/mysql_connection');

// Only Admin can access whole user data.
router.get('/', security.isAdmin, function(req, res, next) {
    getConnection(function(connection) {
        connection.query('CALL ercsb_cdss.getUsers()', function(err, rows) {
            if (err) throw err;
            res.json(rows[0]);
        });
    });
});

/*
 * 보안 상 퍄라미터로 받지 않고, 로그인한 정보로 사용자 정보를 리턴한다.
 */
router.get('/profile', function(req, res, next) {
    getConnection(function(connection) {
        connection.query("call ercsb_cdss.getUserByName(?)", [req.user.username], function(err, rows, fields) {
            if (err) throw err;
            var profile = rows[0][0];

            res.render('system/profile', {
                user: req.user,
                profile: profile
            });
        });
    });
});

router.put('/', function(req, res, next) {
    var colname = req.body.name;
    var colvalue = req.body.value;
    var pk = req.body.pk;

    // console.log(req.body);
    // Check Primary Key
    if (isNaN(pk)) return res.status(400).send('ERRPK:Bad Request!!!');

    getConnection(function(connection) {
        connection.query('update ercsb_cdss.users set ?? = ? where id = ?', [colname, colvalue, pk], function(err, rows) {
            // Check SQL Statement
            if (err) return res.status(500).send(err.code);
            
            // Check whether affected or not
            // console.log(rows);
            if (rows.changedRows != 1) return res.status(500).send(rows.changedRows + ' rows affected.');

            // Finally Return
            res.json({
                message: 'Updated!'
            });
        });
    });
});

module.exports = router;
