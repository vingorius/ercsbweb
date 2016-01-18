// 'use strict';
define("population/comutationplot/comutation/setting_comutation", ["utils", "size", "population/comutationplot/comutation/view_comutation", "population/comutationplot/vo_comutationplot"], function(_utils, _size, _view, _VO)	{
	var definePatient = function(_patient_list, _genes)	{
		var size = _size.initSize("comutationplot_patient_heatmap", 0, 0, 0, 0);
		var patients = _utils.getNotExistDataInObjArray(_patient_list, "sample");

		_view.view(dataSet("comutationplot_patient", true, _patient_list, _genes, size, 
			_utils.ordinalScale(patients, 0, size.width), _utils.ordinalScale(_genes, 0, size.height)));
	}

	var dataSet = function()	{
		return {
			class_name : arguments[0],
			is_patient : arguments[1],
			all_data : arguments[2],
			genes : arguments[3],
			size : arguments[4],
			x : arguments[5],
			y : arguments[6],
		};
	}

	return function(_all_data, _patient_list, _samples, _genes)	{
		var size = _size.initSize("comutationplot_heatmap", 0, 0, 0, 0);

		definePatient(_patient_list, _genes);
		
		_view.view(dataSet("comutationplot", false, _all_data, _genes, size, 
			_utils.ordinalScale(_samples, 0, _VO.VO.getWidth()), _utils.ordinalScale(_genes, 0, size.height)));
	}
});