$(function() {
	$('#ex1').slider({
		tooltip: 'show',
		tooltip_position: 'bottom',
		formatter: function(value) {
			//- return 'Current value: ' + value;
			return value;
		}
	});
	var table = $('#table');
	table.bootstrapTable({
//		url: '/models/patient/getSampleVariantList',
		classes: 'table',
		method: 'get',
		showColumns: true,
		sortName: 'patientsOfPosition',
		sortable: true,
		sortOrder: 'desc',
		rowStyle:function(row,index){ // make first row active
			if(index === 0) return {classes: 'info'};
			return {};
		},
		columns: [{
			field: 'gene',
			title: 'Gene',
			sortable: true,
			align: 'center',
		}, {
			field: 'transcript',
			title: 'Transcript',
			sortable: true,
			align: 'center',
			formatter: function(value, row) {
				var params = [row.cancer_type, row.sample_id, row.gene, row.transcript];
				return '<a href="#" id="transcript">' + value + '</a> ';
			},
			events: 'tsEvents', // needleplot.js
		}, {
			field: 'class',
			title: 'Classification',
			align: 'center',
			formatter: function(value,row){
				return value.replace('_Mutation','');
			}
		}, {
			field: 'cds',
			title: 'CDS Change',
			align: 'center',
		}, {
			field: 'alt',
			title: 'AA Change',
			align: 'center',
		}, {
			field: 'pdomain',
			title: 'Protein Domain',
			align: 'center',
		}, {
			field: 'patientsOfPosition',
			title: 'Frq. in Gene',
			sortable: true,
			align: 'center',
			formatter: function(value, row) {
				var pct = (row.patientsOfPosition / row.patientsOfTranscript) * 100;
				// console.log(row);
				return pct.toFixed(2) + '%' + ' (' + row.patientsOfPosition + '/' + row.patientsOfTranscript + ')';
			}
		}, {
			field: 'patientsOfPosition',
			title: 'Frq. in Total',
			sortable: true,
			align: 'center',
			formatter: function(value, row) {
				var pct = (row.patientsOfPosition / row.patientsOfCancer) * 100;
				// console.log(row);
				return pct.toFixed(2) + '%' + ' (' + row.patientsOfPosition + '/' + row.patientsOfCancer + ')';
			}
		}, {
			field: 'target',
			title: 'Actionable target?',
			align: 'center',
		}]
	});

	table.on('load-success.bs.table', function(_event, _data, _args) {
		var data = _data[0];
		Init.requireJs(
			"analysis_needle",
			"/rest/needleplot?cancer_type=" + data.cancer_type + "&sample_id=" + data.sample_id + "&gene=" + data.gene + "&transcript=" + data.transcript
		);
		//http://192.168.191.159/rest/needleplot?cancer_type=luad&sample_id=Pat99&gene=EGFR&transcript=ENST00000275493
	});

	//
	table.on('click-row.bs.table',function(_event, _data, _args){
	    $(_args[0]).addClass('info').siblings().removeClass('info');
	});

	window.tsEvents = {
		'click #transcript': function(_event, _value, _row, _index) {
			Init.requireJs(
				"analysis_needle",
				"/rest/needleplot?cancer_type=" + _row.cancer_type + "&sample_id=" + _row.sample_id + "&gene=" + _row.gene + "&transcript=" + _row.transcript
			);
		}
	};
});
