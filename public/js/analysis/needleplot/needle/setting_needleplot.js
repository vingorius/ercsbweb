var NEEDLE = "analysis/needleplot/needle/";
var NEEDLE_NAVI = "analysis/needleplot/navigation/";
var LEGEND = "chart/legend/setting_legend";

define(NEEDLE + "setting_needleplot", ["utils", "size", NEEDLE + "view_needleplot", LEGEND, NEEDLE_NAVI + "setting_needlenavigation"], function(_utils, _size, _view, _setting_legend, _setting_navigation)   {
	return function(_data)  {
		var data = _data || [];
		var size = _size.define_size("needleplot_view", 20, 40, 20, 0);
		size.graph_width = 20;
		var cSize = _size.define_size("needleplot_count", 5, 5, 5, 5);

		var get_same_position_list = function(_public_list)    {
			var public_list = _public_list || [];
			var result = [];

			public_list.map(function(_d)    {
				if($.inArray(_d.position, result) < 0) {
					result.push(_d.position);
				}
			});
			return result;
		}

		var get_yaxis_max = function() {
			var public_list = get_same_position_list(data.data.public_list);
			var plus_num = 1;
			var result = 0;

			public_list.map(function(_d)    {
				(result > _utils.get_json_array_in_array(_d, data.data.public_list, "position").length) 
				? result = result : result = _utils.get_json_array_in_array(_d, data.data.public_list, "position").length;
			});
			return result + plus_num;
		}

		var reform_needle_data = function()    {
			var samePosition = get_same_position_list(data.data.public_list);
			var result = [];

			samePosition.map(function(_d)   {
				var subResult = [];
				_utils.get_json_array_in_array(_d, data.data.public_list, "position").map(function(_e)   {
					subResult = reform_needle_json(_e, subResult);
				});
				result.push({ 
					position : _d, 
					public_list : subResult
				});
			});
			return stacked_markers(result);
		}

		var reform_needle_json = function(_e, _result)   {
			var emptyJson = new Object();
			var result = _result || [];
			var alreadyTypeData = _utils.get_json_in_array(_e.type, result, "type");

			if(!alreadyTypeData) {
				result.push({ 
					id : [_e.id], 
					type : _e.type, 
					position : _e.position,
					aachange : [_e.aachange], 
					count : 1 
				});
			}
			else {
				alreadyTypeData.count += 1;
				alreadyTypeData.id.push(_e.id);
				alreadyTypeData.aachange.push(_e.aachange);
			}
			return result;
		}

		var stacked_markers = function(_array)  {
			var array = _array || [];

			array.forEach(function(_d, _i)  {
				_d.public_list.forEach(function(_e, _j) {
					if(_j ===0) { 
						_e.y = 0; 
					}
					else {  
						_e.y = _d.public_list[_j - 1].count - _d.public_list[_j - 1].y;  
					}
				});
			});
			return array;
		}

		var get_mutation_name = function() {
			var result = [];

			data.data.public_list.forEach(function(_d)   {
				if($.inArray(_utils.define_mutation_name(_d.type), result) < 0)  {
					result.push(_utils.define_mutation_name(_d.type));
				}
			});
			return { 
				type_list : result 
			};
		} 

		var mutation_importance = function()	{
			var result = [];

			data.data.public_list.forEach(function(_d)   {
				var mutation = _utils.get_json_in_array(_utils.define_mutation_name(_d.type), result, "name");
				if(mutation)   { 
					mutation.importance += 1; 
				}	
				else {
					result.push({ 
						name : _utils.define_mutation_name(_d.type), 
						importance : 0 
					});
				}
			});
			result.sort(function(_a, _b)	{ 
				return (_a.importance > _b.importance) ? 1 : -1; 
			});
			return result;
		}

		var page_percent = function(_div, _page)	{
			return (_div > _page) ? (_page / _div).toFixed(1) : (_div / _page).toFixed(1);
		}

		var set_radius = function(_count) {
			var count = _count || 0;
			var page = document.body.clientWidth;
			var radius_per =  page_percent(size.width, page);
			
			return Math.sqrt(count) * (5 * radius_per);
		} 

		var set_fontsize = function()	{
			var page = document.body.clientWidth;
			var fontsize_per = page_percent(size.width, page);

			return (12 * fontsize_per).toFixed(0) + "px";
		}

		var ymax = get_yaxis_max();
		var stacked = reform_needle_data();
		var mutations = get_mutation_name();

		_utils.remove_svg(".needleplot_view_yaxis");
		_utils.remove_svg(".needleplot_view");

		 _setting_legend(mutations, "needleplot_legend", null, mutation_importance());
		
		_view.view({
			data : data,
			stacked : stacked,
			size : size,
			csize : cSize,
			x : _utils.linearScale(0, data.data.graph[0].length, size.margin.left, size.rwidth).clamp(true),
			y : _utils.linearScale(ymax, 0, size.margin.top, (size.rheight - size.graph_width)).clamp(true),
			ymax : ymax,
			radius : set_radius,
			fontsize : set_fontsize
		});
		_setting_navigation(data, stacked, ymax);
	}
});