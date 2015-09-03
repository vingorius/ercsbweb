var SAMPLE = "population/comutationplot/sample/";
var VO = "population/comutationplot/vo_comutationplot";

define(SAMPLE + "setting_sample", ["utils", "size", SAMPLE + "view_sample", VO], function(_utils, _size, _view, _VO)	{
	var count_by_order = function(_mutation_list)	{
		var sample_list = [];

		for(var i = 0, len = _mutation_list.length ; i < len ; i++)	{
			var sample = _mutation_list[i];
			var type = _utils.definitionMutationName(sample.type);
			var is_sample = _utils.getObjInArray(sample.sample, sample_list, "sample");

			if(!is_sample)	{
				sample_list.push({
					sample : sample.sample,
					types : [{ 
						sample : sample.sample, 
						type : type, 
						count : 1 }],
					counts : 1
				});
			}
			else {
				var is_type = _utils.getObjInArray(type, is_sample.types, "type");

				if(!is_type)	{ 
					is_sample.types.push({ 
						sample : sample.sample, 
						type : type, 
						count : 1 
					}); 
				}
				else { 
					is_type.count += 1; 
				}
				is_sample.counts += 1;
			}
		}
		return stacked(sample_list);
	}

	var stacked = function(_sample_list)  {
		for(var i = 0, len = _sample_list.length ; i < len ; i++)	{
			var stack_sample = _sample_list[i];
			stack_sample.types = sort_by_mutation(stack_sample.types);
			
			for(var j = 0, leng = stack_sample.types.length ; j < leng ; j++)	{
				var type = stack_sample.types[j];

				if(j === 0)    { 
					type.start = 0; 
				}
				else {
					var pre_type = stack_sample.types[j - 1];
					type.start = pre_type.count + pre_type.start;
				}
			}
		}
		return _sample_list;
	}

	var sort_by_mutation = function(_types)	{
		return _types.sort(function(_a, _b)	{
			var a = _utils.alterationPrecedence(_utils.definitionMutationName(_a.type));
			var b = _utils.alterationPrecedence(_utils.definitionMutationName(_b.type));

			var a_priority = a.alteration === "CNV" ? a.priority + 20 : a.priority;
			var b_priority = b.alteration === "CNV" ? b.priority + 20 : b.priority;

			return (a_priority < b_priority) ? 1 : -1
		});
	}

	var get_max = function(_count_sample)	{
		return d3.max(_count_sample.map(function(_d) {
			return _d.counts;
		}));
	}

	var definePatient = function(_patient_list, _max)	{
		$("#comutationplot_patient_sample").width(5).height(100);
		var size = _size.definitionSize("comutationplot_patient_sample", 20, 20, 0, 0);
		var patients = getPatientList(_patient_list);
		size.left_between = 1.5;
		size.top_between = 1.2;

		_view.view({
			class_name : "comutationplot_patient",
			is_patient : true,
			data : count_by_order(_patient_list),
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
		var count_sample = count_by_order(_mutation_list);
		var size = _size.definitionSize("comutationplot_sample", 20, 20, 0, 0);
		size.magnification = 2;
		size.left_between = 1.5;
		size.top_between = 1.2;
		var title_size = _size.definitionSize("comutationplot_sample_yaxis_title", 20, 20, 20, 20);
		var max = Math.ceil(get_max(count_sample) / 10) * 10;
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
			x : _utils.ordinalScale(_samples, 0, _VO.VO.getInitWidth() * size.magnification),
			y : y
		});
		_view.titleView({
			data : count_sample,
			size : size,
			title_size : title_size,
			max : max,
			y : y
		})
	}
});