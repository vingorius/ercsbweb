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

module.exports = router;
