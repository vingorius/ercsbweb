var express = require('express');
var router = express.Router();
var multer = require('multer')
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
        console.log(req.body) // form fields
        console.log(req.files) // form files
        //res.status(204).end();
        // Insert into metadata into database for later use.
        var data = getRowToBeInsert(req.files.fileName,req.session.user);
        getConnection(function(connection) {
            connection.query('insert into ercsb_cdss.upload_files set ?', data, function(err, rows) {
                if (err) {
                    console.log(err);
                    throw err;
                }
            });
            //바로 보여주도록 함.
            var path = req.files.fileName.path;
            path = path.replace(/^public/, '');
            res.redirect(path);
        });

    }
]);

var getRowToBeInsert = function(info,user) {
    return {
        originalname: info.originalname,
        name: info.name,
        encoding: info.encoding,
        mimetype: info.mimetype,
        path: info.path,
        extension: info.extension,
        size: info.size,
        user: user,
        upload_date: new Date(),
        json: JSON.stringify(info)
    };
}

module.exports = router;
