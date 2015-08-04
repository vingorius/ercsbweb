var express = require('express');
var getConnection = require('../modules/mysql_connection');
var router = express.Router();

router.get('/getSampleVariantList', function(req, res, next) {
	var cancer_type = req.query.cancer_type;
	var sample_id = req.query.sample_id;

    getConnection(function(connection) {
        connection.query('CALL omics_data.getNeedleplotPatientVariantList(?,?)',['luad','Pat99'], function(err, rows) {
            if (err) throw err;
            res.json(rows[0]);
        });
    });
});

module.exports = router;
