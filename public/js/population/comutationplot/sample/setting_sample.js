var SAMPLE = "population/comutationplot/sample/";
var VO = "population/comutationplot/vo_comutationplot";
var SORT = "population/comutationplot/sort_comutationplot";

define(SAMPLE + "setting_sample", ["utils", "size", SORT, SAMPLE + "view_sample", VO], function(_utils, _size, _sort, _view, _VO)	{
	var definePatient = function(_patient_list, _max)	{
		$("#comutationplot_patient_sample").width(5).height(100);
		var size = _size.initSize("comutationplot_patient_sample", 20, 20, 0, 0);
		var patients = getPatientList(_patient_list);

		_view.view({
			class_name : "comutationplot_patient",
			is_patient : true,
			data : _sort.countOrder(_patient_list, "sample"),
			size : size,
			x : _utils.ordinalScale(patients, 0, size.width),
			y : _utils.linearScale(0, _max, (size.height - (size.margin.bottom / 2)), (size.margin.top * 1.5))
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

	return function(_mutation_list, _patient_list, _samples)	{
		var count_sample = _sort.countOrder(_mutation_list, "sample");
		var size = _size.initSize("comutationplot_sample", 20, 20, 0, 0);
		var max = Math.ceil(_utils.getObjectMax(count_sample, "counts") / 10) * 10;
		var y = _utils.linearScale(0, max, (size.height - (size.margin.bottom / 2)), (size.margin.top * 1.5));

		_utils.removeSvg("comutationplot_sample");

		if(_patient_list.length > 0)	{
			definePatient(_patient_list, max);
		}

		_view.view({
			class_name : "comutationplot",
			is_patient : false,
			data : count_sample,
			size : size,
			x : _utils.ordinalScale(_samples, 0, _VO.VO.getWidth()),
			y : y
		});
		_view.titleView({
			data : count_sample,
			size : size,
			title_size : _size.initSize("comutationplot_sample_yaxis_title", 20, 20, 20, 20),
			max : max,
			y : y
		})
	}
});