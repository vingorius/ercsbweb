$(function() {
	// find user locale for date format
	// var locLang = (navigator.language) ? navigator.language : navigator.userLanguage;
	// var userLocale = locLang.substring(0, 2) || 'en';
	// moment.locale(userLocale);


	var table = $('#table');
	table.bootstrapTable({
		url: '/models/patient/getSampleList',
		classes: 'table table-hover table-striped',
		method: 'get',
		toolbar: '#toolbar',
		search: true,
		showRefresh: true,
		showColumns: true,
		pagination: true,
		pageSize: 10,
		sortName: 'cnt',
		sortOrder: 'desc',
		columns: [{
			title: '#',
			align: 'center',
			formatter: function(value, row, index) {
				return index + 1;
			}
		}, {
			field: 'sample_id',
			title: 'Sample ID',
			sortable: true,
			align: 'center',
			class: 'sample_id',
		}, {
			field: 'cancer_type',
			title: 'Type',
			sortable: true,
			align: 'center',
			formatter: function(value, row) {
				return value.toUpperCase();
			}
		}, {
			field: 'requester',
			title: 'Requester',
			sortable: true,
			align: 'center',
		}, {
			field: 'receive_date',
			title: 'Received Date',
			sortable: true,
			align: 'center',
			width: '15%',
			formatter: function(value, row, index) {
				var date = new Date(value);
				return moment(date).fromNow();
			}
		}, {
			field: 'variants_cnt',
			title: '# of Variants',
			sortable: true,
			align: 'center',
			width: '10%',
		}]
	});
	table.on('click-cell.bs.table', function(obj, field, value, $element) {
		//console.log(field, value, row, $element);
		if (field === 'sample_id') {
			console.log($element);
			$.ajax({
					method: "GET",
					url: "/models/patient/bg_public",
					data: {
						cancer_type: $element.cancer_type
					}
				})
				.done(function(cnt) {
					console.log('data',cnt);
					var params = $.param({
						sample_id: $element.sample_id,
						cancer_type: $element.cancer_type,
						total_cnt: $element.total_cnt,
					});
					//initBGPublicData(data);
					bg_public.init(cnt);
					location.href = '/menus/analysis/first?'+params;
				})
				.fail(function(data) {
					console.log('fail', data);
				});
		}
	});

});
