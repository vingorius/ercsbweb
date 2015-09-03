var NEEDLE = "analysis/needleplot/needle/";
var NEEDLE_NAVI = "analysis/needleplot/navigation/";
var LEGEND = "chart/legend/setting_legend";

define(NEEDLE + "setting_needleplot", ["utils", "size", NEEDLE + "view_needleplot", LEGEND, NEEDLE_NAVI + "setting_needlenavigation"], function(_utils, _size, _view, _setting_legend, _setting_navigation)   {
	return function(_data)  {
		var size = _size.definitionSize("needleplot_view", 20, 40, 20, 0);
		size.graph_width = 20;

		var getSamePositionList = function(_public_list)    {
			var result = [];

			_public_list.map(function(_d)    {
				if($.inArray(_d.position, result) < 0) {
					result.push(_d.position);
				}
			});
			return result;
		}

		var getMaximumY = function() {
			var public_list = getSamePositionList(_data.data.public_list || _data.data.sample_list);
			var result = 0;

			public_list.map(function(_d)    {
				(result > _utils.getObjArrInArray(_d, _data.data.public_list || _data.data.sample_list, "position").length) 
				? result = result : result = _utils.getObjArrInArray(_d, _data.data.public_list || _data.data.sample_list, "position").length;
			});
			return result + 1;
		}

		var reformData = function()    {
			var same_pos_list = getSamePositionList(_data.data.public_list || _data.data.sample_list);
			var result = [];

			same_pos_list.map(function(_d)   {
				var sub_result = [];
				_utils.getObjArrInArray(_d, _data.data.public_list || _data.data.sample_list, "position").map(function(_e)   {
					sub_result = reformJson(_e, sub_result);
				});
				result.push({ 
					position : _d, 
					public_list : sub_result
				});
			});
			return makeStack(result);
		}

		var reformJson = function(_e, _result)   {
			var result = _result || [];
			var already_type = _utils.getObjInArray(_e.type, result, "type");

			if(!already_type) {
				result.push({ 
					id : [_e.id], 
					type : _e.type, 
					position : _e.position,
					aachange : [_e.aachange], 
					count : 1 
				});
			}
			else {
				already_type.count += 1;
				already_type.id.push(_e.id);
				already_type.aachange.push(_e.aachange);
			}
			return result;
		}

		var makeStack = function(_array)  {
			_array.forEach(function(_d, _i)  {
				_d.public_list.forEach(function(_e, _j) {
					if(_j ===0) { 
						_e.y = 0; 
					}
					else {  
						_e.y = _d.public_list[_j - 1].count - _d.public_list[_j - 1].y;  
					}
				});
			});
			return _array;
		}

		var getMutationName = function() {
			var result = [];
			var list = _data.data.public_list || _data.data.sample_list;

			list.forEach(function(_d)   {
				if($.inArray(_utils.definitionMutationName(_d.type), result) < 0)  {
					result.push(_utils.definitionMutationName(_d.type));
				}
			});
			return { 
				type_list : result 
			};
		} 

		var mutationImportance = function()	{
			var result = [];
			var list = _data.data.public_list || _data.data.sample_list;

			list.forEach(function(_d)   {
				var mutation = _utils.getObjInArray(_utils.definitionMutationName(_d.type), result, "name");
				if(mutation)   { 
					mutation.importance += 1; 
				}	
				else {
					result.push({ 
						name : _utils.definitionMutationName(_d.type), 
						importance : 0 
					});
				}
			});
			result.sort(function(_a, _b)	{ 
				return (_a.importance > _b.importance) ? 1 : -1; 
			});
			return result;
		}

		var percentPage = function(_div, _page)	{
			return (_div > _page) ? (_page / _div).toFixed(1) : (_div / _page).toFixed(1);
		}

		var setRadius = function(_count) {
			var radius_per =  percentPage(size.width, document.body.clientWidth);
			
			return Math.sqrt(_count) * (5 * radius_per);
		} 

		var setFontSize = function()	{
			var fontsize_per = percentPage(size.width, document.body.clientWidth);

			return (12 * fontsize_per).toFixed(0) + "px";
		}

		var ymax = getMaximumY();
		var stacked = reformData();

		_utils.removeSvg(".needleplot_view_yaxis");
		_utils.removeSvg(".needleplot_view");

		_setting_legend({
			data : getMutationName(),
			view_id : "needleplot_legend",
			type : "generic mutation",
			chart : "needleplot",
			importance : mutationImportance()
		});
		_view.view({
			data : _data,
			stacked : stacked,
			size : size,
			x : _utils.linearScale(0, _data.data.graph[0].length, size.margin.left, size.rwidth).clamp(true),
			y : _utils.linearScale(ymax, 0, size.margin.top, (size.rheight - size.graph_width)).clamp(true),
			ymax : ymax,
			radius : setRadius,
			fontsize : setFontSize
		});
		_setting_navigation(_data, stacked, ymax);
	}
});