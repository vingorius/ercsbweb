var GROUP = "population/comutationplot/group/";
var SORT = "population/comutationplot/sort_comutationplot";

define(GROUP + "setting_group", ["utils", "size", SORT, GROUP + "view_group"], function(_utils, _size, _sort, _view)	{
	var getGroupName = function(_group_list)	{
		var result = [];

		for(var i = 0, len = _group_list.length ; i < len ; i++)	{
			var name = _group_list[i].name;

			result.push(name);
		}
		return result;
	}

	var modifySize = function(_all_group)	{
		return _all_group.length * 25;
	}

	var colourGroup = function(_type, _value)	{
		return {
			source : {
				"TCGA" : "#849093",
				"ERCSB" : "#59d0f4"
			}[_value],
			smoking : {
				"smoker" : "#ea3b29",
				"non-smoker" : "#5cb755",
				"reformed" : "#ff9000",
				"NA" : "#D5DDDD"
			}[_value],
			gender : {
				"male" : "#1F3A93",
				"female" : "#DB0A5B"
			}[_value],
			histological_type : {
				"lung adenocarcinoma- not otherwise specified (nos)" : "#FDC693",
				"lung adenocarcinoma mixed subtype" : "#84AE83",
				"lung papillary adenocarcinoma" : "#635472",
				"lung mucinous adenocarcinoma" : "#993366",
				"mucinous (colloid) carcinoma" : "#F5D76E",
				"lung clear cell adenocarcinoma" : "#C06D9B",
				"lung acinar adenocarcinoma" : "#0B292F",
				"lung bronchioloalveolar carcinoma nonmucinous" : "#782c14",
				"lung bronchioloalveolar carcinoma mucinous" : "#fe0001",
				"lung solid pattern predominant adenocarcinoma" : "#f868f7",
				"lung micropapillary adenocarcinoma" : "#0cf27d"
			}[_value]
		}[_type];
	}

	var formatedPatient = function(_patient_list)	{
		var result = [];

		for(var i = 0, len = _patient_list.length ; i < len ; i++)	{
			var patient = _patient_list[i];
			var is_patient = _utils.getObjInArray(patient.sample, result, "sample");

			if(!is_patient)	{
				result.push({
					sample : patient.sample,
					gene : [ patient.gene ],
					type : [ patient.type ]
				});
			}
			else {
				is_patient.gene.push(patient.gene);
				is_patient.type.push(patient.type);
			}
		}
		return result;
	}

	var groupPatient = function(_group_names, _formated_patient)	{
		var result = [];
		var f_patient = _formated_patient;

		for(var i = 0, len = _group_names.length ; i < len ; i++)		{
			var name = _group_names[i];
			var patient = {
				sample : f_patient.sample,
				gene : f_patient.gene,
				type : f_patient.gene,
				name : name,
				value : undefined
			};
			result.push(patient);
		}
		return result;
	}

	var definePatient = function(_height, _patient_list, _group_names)		{
		$("#comutationplot_patient_groups").width(5).height(_height);
		var size = _size.definitionSize("comutationplot_patient_groups", 20, 20, 0, 0);
		size.left_between = 1.5;
		size.top_between = 1.2;

		_view.view({
			class_name : "comutationplot_patient",
			name : _group_names,
			data : _patient_list,
			patients : getPatientList(_patient_list),
			size : size,
			colour : colourGroup
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

	return function(_group_list, _patient_list, _samples)	{
		_group_list.sort(function(_a, _b)	{
			var rtn = _a.name.length < _b.name.length ? -1 : 1;
			return rtn;
		});
		var group_names = getGroupName(_group_list);
		var all_group = _sort.grouping(_group_list, _samples);
		var init_height = modifySize(all_group);
		$("#comutationplot_groups").css("height", init_height);
		$("#comutationplot_groups_name").css("height", init_height);
		var size = _size.definitionSize("comutationplot_groups", 20, 20, 0, 0);
		size.magnification = 2;
		size.left_between = 1.5;
		size.top_between = 1.2;
		var name_size = _size.definitionSize("comutationplot_groups_name", 20, 20, 20, 20);

		if(_patient_list.length > 0)	{
			var patient = formatedPatient(_patient_list);
			var patient_group = groupPatient(group_names, patient[0]);

			definePatient(init_height, patient_group, group_names);
		}

		_view.view({
			class_name : "comutationplot",
			name : group_names,
			data : all_group,
			size : size,
			colour : colourGroup
		});
		_view.nameView({
			name : group_names,
			data : all_group,
			size : size,
			name_size : name_size
		})
	}
});