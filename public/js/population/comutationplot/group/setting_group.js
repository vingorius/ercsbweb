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

	var grouping = function(_group_list, _samples)	{
		var grouped = [];

		for(var i = 0, len = _group_list.length ; i < len ; i++)	{
			var group = _group_list[i];
			grouped.push(mergeGroup(_sort.group(group.data, group.data, _samples)));
		}
		return grouped;
	}

	var mergeGroup = function(_grouping)	{
		var result = [];

		for(var i = 0, len = _grouping.length ; i < len ; i++)	{
			$.merge(result, _grouping[i]);
		}
		return result;
	}

	var modifySize = function(_all_group)	{
		return _all_group.length * 25;
	}

	var colourGroup = function(_type, _value)	{
		return {
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
				"lung bronchioloalveolar carcinoma nonmucinous" : "#A7C9D1",
				"lung bronchioloalveolar carcinoma mucinous" : "#F89406",
				"lung solid pattern predominant adenocarcinoma" : "#3B4254",
				"lung micropapillary adenocarcinoma" : "#286868"
			}[_value]
		}[_type];
	}

	return function(_group_list, _samples)	{
		var group_names = getGroupName(_group_list);
		var all_group = grouping(_group_list, _samples);
		var init_height = modifySize(all_group);
		$("#comutationplot_groups").css("height", init_height);
		$("#comutationplot_groups_name").css("height", init_height);
		var size = _size.define_size("comutationplot_groups", 20, 20, 0, 0);
		var name_size = _size.define_size("comutationplot_groups_name", 20, 20, 20, 20);

		_view.view({
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