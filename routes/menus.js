var express = require('express');
var passport = require('passport');
var getConnection = require('./modules/mysql_connection');
var router = express.Router();

router.use(function(req, res, next) {
    // console.log('menu: ', req.query);
    if (req.query.sample_id !== undefined && req.query.cancer_type !== undefined) {
        req.session.sample_id = req.query.sample_id;
        req.session.cancer_type = req.query.cancer_type;
    }

    res.locals.sample = {
        id: req.session.sample_id,
        type: req.session.cancer_type,
    };
    next();
});

router.get('/', function(req, res, next) {
    res.render('menus/index');
});

router.get('/analysis/first', function(req, res, next) {
    // 사용자가 화면 주소를 복사하여 다른 브라우저를 열고 붙여넣기했을 때 이 값이 없이 들어올 수 있다.
    if (!res.locals.sample.id || !res.locals.sample.type)
        res.redirect('/menus');

    res.redirect('summary');
});

router.get('/analysis/summary', function(req, res, next) {
    var sample_id = res.locals.sample.id;
    var cancer_type = res.locals.sample.type;

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
                res.render('menus/analysis/summary', patient);
            });
        });
    });
});

router.get('/:folder/:page', function(req, res, next) {
    // 사용자가 화면 주소를 복사하여 다른 브라우저를 열고 붙여넣기했을 때 이 값이 없이 들어올 수 있다.
    if (!res.locals.sample.id || !res.locals.sample.type)
        res.redirect('/menus');

    var loc = 'menus/' + req.params.folder + '/' + req.params.page;
    res.render(loc);
});

module.exports = router;
