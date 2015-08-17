var GROUP = "population/comutationplot/group/";
var SORT = "population/comutationplot/sort_comutationplot";

define(GROUP + "setting_group", ["utils", "size", SORT], function(_utils, _size, _sort)	{
	var grouping = function(_group_list, _samples)	{
		var grouped = [];

		for(var i = 0, len = _group_list.length ; i < len ; i++)	{
			var group = _group_list[i];
			grouped.push(mergeGroup(_sort.group(group.data, _samples)));
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

	return function(_group_list, _samples)	{
		console.log(grouping(_group_list, _samples));
	}
});