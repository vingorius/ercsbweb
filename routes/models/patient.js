var express = require('express');
var getConnection = require('../modules/mysql_connection');
var router = express.Router();

router.get('/getSampleList', function(req, res, next) {
    getConnection(function(connection) {
        connection.query('CALL CGIS.sp_getSampleReceptionList()', function(err, rows) {
            if (err) return next(err);
            res.json(rows[0]);
        });
    });
});
/*
router.get('/getSummary', function(req, res, next) {
    // var sample_id = res.locals.sample.id;
    // var cancer_type = res.locals.sample.type;
    var cancer_type = req.query.cancer_type;
    var sample_id = req.query.sample_id;

    var patient = {
        info: {},
        genomic_alt: 0,
        mutational_cd: 0,
        cosmic_cgc: 0,
        fda_cancer: 0,
        fda_other_cancer: 0,
        clinical_trials: 0,
        implications: [],
    };

    getConnection(function(connection) {
        connection.query('CALL omics_data.getPatientInfo(?,?)', [cancer_type, sample_id], function(err, rows) {
            patient.info = rows[0][0];
            connection.query('CALL omics_data.getPersonalSummary(?,?)', [cancer_type, sample_id], function(err, rows) {
                if (err) return next(err);

                var list = rows[0];
                patient.genomic_alt = list.length;
                list.forEach(function(item) {
                    if (item.mdAnderson > 0) patient.mutational_cd++;
                    if (item.countOfCOSMIC > 0) patient.cosmic_cgc++;
                    if (item.fda_cancer !== null)
                        patient.fda_cancer += item.fda_cancer.split(',').length;
                    if (item.fda_other_cancer !== null)
                        patient.fda_other_cancer += item.fda_other_cancer.split(',').length;
                    if (item.clinical_trials !== null)
                        patient.clinical_trials += item.clinical_trials.split(',').length;
                });
                patient.implications = list;
                // res.render('menus/analysis/summary', patient);
                res.json(patient);
            });
        });
    });
});
*/

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
        connection.query('CALL CGIS.sp_getPersonalVaiantsSummary(?,?,?,?,?,?,?)', params, function(err, rows) {
            if (err) return next(err);
            res.json(rows[0]);
        });
    });
});

router.get('/bg_public', function(req, res, next) {
    var cancer_type = req.query.cancer_type;

    getConnection(function(connection) {
        connection.query('select CGIS.sf_countOfGDACByCancerType(?) cnt', [cancer_type], function(err, rows) {
            if (err) return next(err);
            res.json(rows[0].cnt);
        });
    });

});

router.get('/bg_filtered_public', function(req, res, next) {
    var cancer_type = req.query.cancer_type;
    var filter_option = req.query.filter_option;
    console.log('bg_filtered_public', req.query);
    getConnection(function(connection) {
        connection.query('CALL CGIS.sp_getPatientCountByFilter(?,?)', [cancer_type, filter_option], function(err, rows) {
            if (err) return next(err);
            console.log(rows[0][0].cnt);
            res.json(rows[0][0].cnt);
        });
    });

});


module.exports = router;
