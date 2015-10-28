define("population/comutationplot/group/setting_group", ["utils", "size", "population/comutationplot/sort_comutationplot", "population/comutationplot/group/view_group"], function(_utils, _size, _sort, _view)	{
	var setGroupHeight = function(_all_group)	{
		var height = _all_group.length * 15 + 10 < 30 ? 30 : _all_group.length * 15 + 10;

		$("#comutationplot_group_empty, #comutationplot_groups, #comutationplot_groups_name")
		.height(height);

		return height;
	}

	var formatedPatient = function(_patient_list)	{
		var result = [];

		for(var i = 0, len = _patient_list.length ; i < len ; i++)	{
			var patient = _patient_list[i];
			var is_patient = _utils.getObject(patient.sample, result, "sample");

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

	var dataSet = function()	{
		var set = {
			class_name : arguments[0],
			name : arguments[1],
			data : arguments[2],
			size : arguments[3],
		};
		typeof arguments[4] === "function" ? set.colour = arguments[4] : set.name_size = arguments[4];
		arguments[5] ? set.patients = arguments[5] : set = set;
		return set;
	}

	var viewPatients = function(_height, _patient_list, _group_names)		{
		$("#comutationplot_patient_groups").width(5).height(_height);
		var size = _size.initSize("comutationplot_patient_groups", 10, 20, 0, 0);

		_view.view(dataSet("comutationplot_patient", _group_names, _patient_list, size, _utils.defGroup,
			 _utils.getNotExistDataInObjArray(_patient_list, "sample")));
	}

	return function(_group_list, _patient_list, _samples)	{
		var group_names = _utils.getOnlyDataObjArray(_group_list, "name");
		var all_group = _sort.grouped(_group_list, _samples).merge;
		var init_height = setGroupHeight(all_group);
		var size = _size.initSize("comutationplot_groups", 10, 20, 0, 0);
		var name_size = _size.initSize("comutationplot_groups_name", 10, 20, 20, 20);

		if(_patient_list.length > 0)	{
			var patient = formatedPatient(_patient_list);
			var patient_group = groupPatient(group_names, patient[0]);

			viewPatients(init_height, patient_group, group_names);
		}

		_view.view(dataSet("comutationplot", group_names, all_group, size, _utils.defGroup));
		_view.nameView(dataSet("comutationplot_groups_name", group_names, all_group, size, name_size));
	}
});