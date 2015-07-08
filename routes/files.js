var express = require('express');
var router = express.Router();
var multer = require('multer');
var getConnection = require('./modules/mysql_connection');

router.get('/',
    function(req, res) {
        res.render('files/fileupload');
    }
);

router.post('/upload', [
    multer({
        dest: './public/datas/'
    }),
    function(req, res, next) {
        // console.log(req.body) // form fields
        // console.log(req.files) // form files
        //res.status(204).end();

        // Insert metadata into database for later use.
        var data = getRowToBeInsert(req.files.fileName, req.session.user);
        getConnection(function(connection) {
            connection.query('insert into ercsb_cdss.upload_files set ?', data, function(err, rows) {
                if (err) throw err;
            });
            //바로 보여주도록 함.
            var path = req.files.fileName.path;
            path = path.replace(/^public/, '');
            res.redirect(path);
        });

    }
]);
var getRowToBeInsert = function(info, user) {
    return {
        originalname: info.originalname,
        name: info.name,
        encoding: info.encoding,
        mimetype: info.mimetype,
        path: info.path.replace(/^public/, ''),
        extension: info.extension,
        size: info.size,
        user: user,
        upload_date: new Date(),
        json: JSON.stringify(info)
    };
};

//아래는 TSV를 JSON으로 바꾸는 샘플이다.
var fs = require('fs');
var tsv = require('tsv');

router.get('/readtsv',
    function(req, res) {
        fs.readFile('public/datas/maf.tsv', 'utf8', function(err, data) {
            if (err) return err;
            res.json(tsv.parse(data));
        });
        //res.status(204).end();
    }
);

module.exports = router;
