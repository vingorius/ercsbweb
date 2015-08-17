var express = require('express');
var getConnection = require('../modules/mysql_connection');
var router = express.Router();

router.get('/getSampleVariantList', function(req, res, next) {
	var cancer_type = req.query.cancer_type;
	var sample_id = req.query.sample_id;
	console.log(sample_id,cancer_type);
    getConnection(function(connection) {
        connection.query('CALL omics_data.getNeedleplotPatientVariantList(?,?)',[cancer_type,sample_id], function(err, rows) {
            if (err) throw err;
            res.json(rows[0]);
        });
    });
});

router.get('/getSampleList', function(req, res, next) {
    getConnection(function(connection) {
        connection.query('CALL omics_data.getPageTestSampleList()', function(err, rows) {
            if (err) throw err;
            res.json(rows[0]);
        });
    });
});

module.exports = router;
