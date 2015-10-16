define("population/comutationplot/group/setting_group", ["utils", "size", "population/comutationplot/sort_comutationplot", "population/comutationplot/group/view_group"], function(_utils, _size, _sort, _view)	{
	var getGroupName = function(_group_list)	{
		var result = [];

		for(var i = 0, len = _group_list.length ; i < len ; i++)	{
			var name = _group_list[i].name;

			result.push(name);
		}
		return result;
	}

	var modifySize = function(_all_group)	{
		var height = _all_group.length * 15 + 10 < 30 ? 30 : _all_group.length * 15 + 10;

		$(".comutationplot_group_area").height(height + 5);
		$("#comutationplot_group_empty").height(height);

		return height;
	}

	var colourGroup = function(_type, _value)	{
		return {
			Expression_Subtype : {
				"Squamoid" : "#05146b",
				"Magnoid" : "#2fcbff",
				"Bronchioid" : "#ff809f",
				"NA" : "#d5dddd",
			}[_value],
			Tobacco_Smoking_History : {
				"Current reformed smoker for > 15 years" : "#FEC39C",
				"Lifelong Non-smoker" : "#93FE2F",
				"Current reformed smoker for < or = 15 years" : "#F1FE86",
				"Current smoker" : "#980713",
				"Current Reformed Smoker, Duration Not Specified" : "#FD0D21",
				"NA" : "#d5dddd",	
			}[_value],
			Pathology : {
				"Acinar predominant Adc" : "#664A1F",
				"Adenocarcinoma, NOS" : "#815540",
				"Colloid adenoca" : "#73324F",
				"Invasive mucinous" : "#BD9011",
				"Lepidic predominant Adc" : "#2F5930",
				"Micropapillary predom Adc" : "#445D44",
				"Other see comment" : "#0B8782",
				"Papillary predominant Adc" : "#EB4F8A",
				"Solid predominant Adc" : "#EE9DAD",
				"NSCLC, favor Adeno" : "#8F6B99",
				"NA" : "#d5dddd",
			}[_value],
			Pathologic_Stage : {
				"Stage IA" : "#660033",
				"Stage IB" : "#CC9900",
				"Stage IIA" : "#EE0088",
				"Stage IIB" : "#99AA00",
				"Stage IIIA" : "#006600",
				"Stage IV" : "#CCFF66",
				"Stage I" : "#660066",
				"Stage IIIB" : "#008888",
				"NA" : "#d5dddd",			
			}[_value],
			Radiation_Therapy : {
				"NO" : "#ef4a59",
				"YES" : "#06b200",
				"NA" : "#d5dddd",
			}[_value],
			Histological_Type : {
				"Lung Adenocarcinoma- Not Otherwise Specified (NOS)" : "#E2D7B1",
				"Lung Adenocarcinoma Mixed Subtype" : "#8DD3C9",
				"Lung Papillary Adenocarcinoma" : "#56075B",
				"Lung Mucinous Adenocarcinoma" : "#90C0ED",
				"Mucinous (Colloid) Carcinoma" : "#EEEFC6",
				"Lung Clear Cell Adenocarcinoma" : "#CC5045",
				"Lung Acinar Adenocarcinoma" : "#A7E8EF",
				"Lung Bronchioloalveolar Carcinoma Nonmucinous" : "#C49E66",
				"Lung Bronchioloalveolar Carcinoma Mucinous" : "#ABB742",
				"Lung Solid Pattern Predominant Adenocarcinoma" : "#2D2D25",
				"Lung Micropapillary Adenocarcinoma" : "#93938F",
				"NA" : "#d5dddd",
			}[_value],
			Gender : {
				"MALE" : "#0024ff",
				"FEMALE" : "#ff00db",
				"NA" : "#d5dddd",
			}[_value],
			Vital_Status : {
				"LIVING" : "#00FF2B",
				"DECEASED" : "#FF001A",
				"NA" : "#d5dddd",
			}[_value],
			gender : {
				"male" : "#0024ff",
				"female" : "#ff00db",
				"NA" : "#d5dddd",
			}[_value],
			source : {
				"TCGA" : "#849093",
				"ERCSB" : "#59d0f4",
				"NA" : "#d5dddd",
			}[_value],
			smoking : {
				"smoker" : "#ea3b29",
				"non-smoker" : "#5cb755",
				"reformed" : "#ff9000",
				"NA" : "#d5dddd",
			}[_value],
			race : {
				"asian" : "#f5a43f",
				"white" : "#f1ec85",
				"black or african ame" : "#5B5B5B",
				"american indian or alaska native" : "#4af380",
				"NA" : "#d5dddd",
			}[_value]
		}[_type];
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

	var definePatient = function(_height, _patient_list, _group_names)		{
		$("#comutationplot_patient_groups").width(5).height(_height);
		var size = _size.initSize("comutationplot_patient_groups", 10, 20, 0, 0);

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
		var group_names = getGroupName(_group_list);
		var all_group = _sort.grouped(_group_list, _samples).merge;
		var init_height = modifySize(all_group);
		$("#comutationplot_groups").css("height", init_height);
		$("#comutationplot_groups_name").css("height", init_height);
		var size = _size.initSize("comutationplot_groups", 10, 20, 0, 0);
		var name_size = _size.initSize("comutationplot_groups_name", 10, 20, 20, 20);

		if(_patient_list.length > 0)	{
			var patient = formatedPatient(_patient_list);
			var patient_group = groupPatient(group_names, patient[0]);
			// console.log(patient, patient_group, group_names);
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