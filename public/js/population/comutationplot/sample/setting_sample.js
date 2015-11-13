// 'use strict';
var SAMPLE = "population/comutationplot/sample/";
var VO = "population/comutationplot/vo_comutationplot";
var SORT = "population/comutationplot/sort_comutationplot";

define(SAMPLE + "setting_sample", ["utils", "size", SORT, SAMPLE + "view_sample", VO], function(_utils, _size, _sort, _view, _VO)	{
	var dataSet = function()	{
		var set = {
			class_name : arguments[0],
			data : arguments[1],
			size : arguments[2],
			y : arguments[3],
		};
		typeof arguments[4] === "function" ? set.x = arguments[4] : set.max = arguments[4];
		typeof arguments[5] === "object" ? set.title_size = arguments[5] : set.is_patient = arguments[5];
		return set;
	}

	var definePatient = function(_patient_list, _max)	{
		$("#comutationplot_patient_sample").width(5).height(100);
		var size = _size.initSize("comutationplot_patient_sample", 20, 20, 0, 0);
		var patients = _utils.getNotExistDataInObjArray(_patient_list, "sample");
		
		_view.view(dataSet("comutationplot_patient", _sort.countOrder(_patient_list, "sample"), size, 
			_utils.linearScale(0, _max, (size.height - (size.margin.bottom / 2)), (size.margin.top * 1.5)), 
			_utils.ordinalScale(patients, 0, size.width), true));
	}

	return function(_mutation_list, _patient_list, _samples)	{
		var count_sample = _sort.countOrder(_mutation_list, "sample");
		var size = _size.initSize("comutationplot_sample", 20, 20, 0, 0);
		var max = Math.ceil(_utils.getObjectMax(count_sample, "counts") / 10) * 10;
		var y = _utils.linearScale(0, max, (size.height - (size.margin.bottom / 2)), (size.margin.top * 1.5));

		_utils.removeSvg("comutationplot_sample");

		if(_patient_list.length > 0)	{
			definePatient(_patient_list, max);
		}
		_view.view(dataSet("comutationplot", count_sample, size, y, 
			_utils.ordinalScale(_samples, 0, _VO.VO.getWidth(), false)));
		_view.titleView(dataSet("comutationplot_sample_title", count_sample, size, y, max, 
			_size.initSize("comutationplot_sample_yaxis_title", 20, 20, 20, 20)));
	}
});