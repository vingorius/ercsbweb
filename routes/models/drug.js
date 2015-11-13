var express = require('express');
var getConnection = require('../modules/mysql_connection');
var router = express.Router();

//http://192.168.191.159/models/drug/getPathwayDrugList?pathway_gene=BRAF&cancer_type=luad
router.get('/getPathwayDrugList', function(req, res, next) {
    var cancer_type = req.query.cancer_type;
    var pathway_gene = req.query.pathway_gene;
    getConnection(function(connection) {
        connection.query('CALL CGIS.sp_getPathwayplotDrugList(?,?)', [cancer_type, pathway_gene], function(err, rows) {
            if (err) return next(err);
            res.json(rows[0]);
        });
    });
});

router.get('/getDrugListByPatient', function(req, res, next) {
    var cancer_type = req.query.cancer_type;
    var sample_id = req.query.sample_id;
    getConnection(function(connection) {
        connection.query('CALL CGIS.sp_getDrugListByPatient(?,?)', [cancer_type, sample_id], function(err, rows) {
            if (err) return next(err);
            res.json(rows[0]);
        });
    });
});

router.get('/getDrugListByCancer', function(req, res, next) {
    var cancer_type = req.query.cancer_type;
    var sample_id = req.query.sample_id;
    getConnection(function(connection) {
        connection.query('CALL CGIS.sp_getDrugListByCancer(?,?)', [cancer_type, sample_id], function(err, rows) {
            if (err) return next(err);
            res.json(rows[0]);
        });
    });
});

router.get('/getDriveGeneInfo', function(req, res, next) {
    var gene_id = req.query.gene_id;
    getConnection(function(connection) {
        connection.query('CALL CGIS.sp_getDriveGeneInfo(?)', [gene_id], function(err, rows) {
            if (err) return next(err);
            res.json(rows[0]);
        });
    });
});

module.exports = router;
