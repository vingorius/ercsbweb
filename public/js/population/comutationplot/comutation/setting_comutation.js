var COMUTATION = "population/comutationplot/comutation/";
var VO = "population/comutationplot/vo_comutationplot";

define(COMUTATION + "setting_comutation", ["utils", "size", COMUTATION + "view_comutation", VO], function(_utils, _size, _view, _VO)	{
	var definePatient = function(_patient_list, _genes)	{
		var patient_heatmap = $("#comutationplot_patient_heatmap");
		patient_heatmap.width(5).height(580);
		var size = _size.initSize("comutationplot_patient_heatmap", 0, 0, 0, 0);
		var patients = getPatientList(_patient_list);
		size.left_between = 1.5;
		size.top_between = 1.2;

		_view.view({
			class_name : "comutationplot_patient",
			is_patient : true,
			all_data : _patient_list,
			genes : _genes,
			size : size,
			x : _utils.ordinalScale(patients, 0, size.width),
			y : _utils.ordinalScale(_genes, 0, size.height)
		});
	}

	var getPatientList = function(_patient_list)	{
		var result = [];

		for(var i = 0, len = _patient_list.length ; i < len ; i++)	{
			var patient = _patient_list[i];
			
			if($.inArray(patient.sample, result) < 0)	{
				result.push(patient.sample);
			}
		}
		return result;
	}

	return function(_all_data, _patient_list, _samples, _genes)	{
		var size = _size.initSize("comutationplot_heatmap", 0, 0, 0, 0);
		size.magnification = 2;
		size.left_between = 1.5;
		size.top_between = 1.2;

		if(_patient_list.length > 0)	{
			definePatient(_patient_list, _genes);
		}

		_VO.VO.setInitWidth(size.width);
		_VO.VO.setInitHeight(size.height);
		_VO.VO.setWidth(size.width);
		_VO.VO.setHeight(size.height);

		_utils.removeSvg("comutationplot_heatmap");
		
		_view.view({
			class_name : "comutationplot",
			is_patient : false,
			all_data : _all_data,
			genes : _genes,
			size : size,
			x : _utils.ordinalScale(_samples, 0, size.width * size.magnification),
			y : _utils.ordinalScale(_genes, 0, size.height)
		});
	}
});