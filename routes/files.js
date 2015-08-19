var express = require('express');
var router = express.Router();
var multer = require('multer');
var getConnection = require('./modules/mysql_connection');

router.get('/', function(req, res) {
	res.render('files/fileupload');
});

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

router.get('/readtsv', function(req, res) {
	fs.readFile('public/datas/maf.tsv', 'utf8', function(err, data) {
		if (err) return err;
		res.json(tsv.parse(data));
	});
	//res.status(204).end();
});

// 다음은 xls 파일을 읽어 worksheet별로 저장된 CoMutataion 데이터를 파싱하여 객체를 만드는 코드이다.
var xlsx = require('xlsx');
router.get('/readExcel', function(req, res) {

	var workbook = xlsx.readFile('public/datas/a.xls');
	var worksheet1 = workbook.Sheets[workbook.SheetNames[0]];
	var worksheet2 = workbook.Sheets[workbook.SheetNames[1]];
	//console.log(worksheet1);
	var mutation_list = {
		sample: [],
		gene: [],
		type: []
	};
	for (var cell in worksheet1) {
		/* all keys that do not begin with "!" correspond to cell addresses */
		if (cell[0] === '!') continue;
		var value = worksheet1[cell].v;
		switch (cell.charAt(0)) {
			case 'A':
				mutation_list.sample.push(value);
				break;
			case 'B':
				mutation_list.gene.push(value);
				break;
			case 'C':
				mutation_list.type.push(value);
				break;
		}
		//console.log(z + "=" + JSON.stringify(worksheet1[z].v));
	}
	//res.json(worksheet1);
	res.json(mutation_list);
});

module.exports = router;
