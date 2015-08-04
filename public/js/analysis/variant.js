$(function() {
	$('#ex1').slider({
		tooltip: 'show',
		tooltip_position: 'bottom',
		formatter: function(value) {
			//- return 'Current value: ' + value;
			return value;
		}
	});

	$('#table').bootstrapTable({
		url: '/models/patient/getSampleVariantList',
		method: 'get',
		sortName: 'freq',
		sortable: true,
		sortOrder: 'desc',
		columns: [{
			field: 'gene',
			title: 'Gene',
			sortable: true,
		}, {
			field: 'transcript',
			title: 'Transcript',
			sortable: true,
			formatter: function(value, row) {
				var params = [row.cancer_type, row.sample_id, row.gene, row.transcript];
				return '<a href="#" id="transcript">' + value + '</a> ';
			},
			events: 'tsEvents', // needleplot.js
		}, {
			field: 'class',
			title: 'Classification',
		}, {
			field: 'alt',
			title: 'Alter',
		}, {
			field: 'pdomain',
			title: 'Protein Domain',
		}, {
			field: 'freq',
			title: 'Frequency in TCGA',
			sortable: true,
		}, {
			field: 'target',
			title: 'Actionable target?',
		}]
	});

	$('#table').on('load-success.bs.table', function (e, name, args) {
		//console.log(name[0]);
		//drawNeedleplot(cancer_type,sample_id,gene,transcript);
	});

	window.tsEvents = {
		'click #transcript': function (e, value, row, index) {
			//alert('You click like action, row: ' + JSON.stringify(row));
			//drawNeedleplot(cancer_type,sample_id,gene,transcript);
		}
	};
});
