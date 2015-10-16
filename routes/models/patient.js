var express = require('express');
var getConnection = require('../modules/mysql_connection');
var router = express.Router();

router.get('/getSampleList', function(req, res, next) {
    getConnection(function(connection) {
        connection.query('CALL omics_data.getSampleReceptionList()', function(err, rows) {
            if (err) throw err;
            res.json(rows[0]);
        });
    });
});


router.get('/getSampleVariantList', function(req, res, next) {
    var cancer_type = req.query.cancer_type;
    var sample_id = req.query.sample_id;
    var frequency = req.query.frequency;
    var classification = req.query.classification;
    var cosmic = req.query.cosmic;
    var driver = req.query.driver;
    var filter_option = req.query.filter_option;

    // console.log(req.query);

    if (cancer_type === undefined || sample_id === undefined || frequency === undefined || classification === undefined || cosmic === undefined || driver === undefined || filter_option === undefined) {
        return res.status(400).send('Not sufficient paramerters');
    }

    getConnection(function(connection) {
        var params = [cancer_type, sample_id, classification, cosmic, driver, frequency, filter_option];
        connection.query('CALL omics_data.getPersonalVaiantsSummary(?,?,?,?,?,?,?)', params, function(err, rows) {
            if (err) throw err;
            res.json(rows[0]);
        });
    });
});

router.get('/bg_public', function(req, res, next) {
    var cancer_type = req.query.cancer_type;

    getConnection(function(connection) {
        connection.query('select omics_data.countOfGDACByCancerType(?) cnt', [cancer_type], function(err, rows) {
            if (err) throw err;
            res.json(rows[0].cnt);
        });
    });

});

router.get('/bg_filtered_public', function(req, res, next) {
    var cancer_type = req.query.cancer_type;
    var filter_option = req.query.filter_option;
    console.log('bg_filtered_public', req.query);
    getConnection(function(connection) {
        connection.query('CALL omics_data.getPatientCountByFilter(?,?)', [cancer_type, filter_option], function(err, rows) {
            if (err) throw err;
            console.log(rows[0][0].cnt);
            res.json(rows[0][0].cnt);
        });
    });

});


module.exports = router;
