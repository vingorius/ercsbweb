$(function() {
	// find user locale for date format
	var locLang = (navigator.language) ? navigator.language : navigator.userLanguage;
	var userLocale = locLang.substring(0, 2) || 'en';
	//moment.locale(userLocale);


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
			// formatter: function(value, row) {
			// 	console.log(row);
			// 	var params = $.param({
			// 		sample_id: row.sample_id,
			// 		cancer_type: row.cancer_type,
			// 		total_cnt: row.total_cnt,
			// 	});
			// 	// console.log(param);
			// 	//return '<a href="/menus/analysis/first?' + params + '">' + value + '</a>';
			// 	return '<span name="sample_id">' + value + '</span>';
			// }
		}, {
			field: 'cancer_type',
			title: 'Type',
			align: 'center',
			formatter: function(value, row) {
				return value.toUpperCase();
			}
		}, {
			field: 'pic',
			title: 'PiC',
			sortable: true,
			align: 'center',
		}, {
			title: 'Date',
			align: 'center',
			width: '15%',
			formatter: function(value, row, index) {
				var date = new Date();
				date.setDate(date.getDate() - index);
				return moment(date).fromNow();
			}
		}, {
			field: 'cnt',
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
				.done(function(data) {
					var params = $.param({
						sample_id: $element.sample_id,
						cancer_type: $element.cancer_type,
						total_cnt: $element.total_cnt,
					});
					//initBGPublicData(data);
					bg_public.init(data);
					console.log('getCountOfPublic', bg_public.getCount());
					console.log('getCountOfFilteredPublic', bg_public.getFilteredCount());
					location.href = '/menus/analysis/first?'+params;
				})
				.fail(function(data) {
					alert('fail', data);
				});
		}
	});

});
