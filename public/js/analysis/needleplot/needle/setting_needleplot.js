var NEEDLE = "analysis/needleplot/needle/";
var NEEDLE_NAVI = "analysis/needleplot/navigation/";
var LEGEND = "chart/legend/setting_legend";

define(NEEDLE + "setting_needleplot", ["utils", "size", NEEDLE + "view_needleplot", LEGEND, NEEDLE_NAVI + "setting_needlenavigation"], function(_utils, _size, _view, _setting_legend, _setting_navigation)   {
	return function(_data)  {
		var size = _size.initSize("needleplot_view", 20, 40, 20, 0);
		size.graph_width = 20;

		// var filtered = function()	{
		// 	var global_filtered_data = JSON.parse(localStorage.FILTERED);
			
		// 	_data.data.public_list = _data.data.public_list.filter(function(_d)	{
		// 		return _utils.getObject(_d.id, global_filtered_data, "patient_id");
		// 	});

		// 	console.log("Filtered sample data : ", _data.data.public_list);
		// }

		var checkProtein = function()	{
			var warning = $("#needleplot_view");
			var visible_set = $("#needleplot_navigation, #needleplot_legend");

			if(warning.text().length > 0)	{
				warning.text("");
			}
			
			if(Object.keys(_data.data.graph).length === 0)	{
				console.log("No data");
				visible_set.css("visibility", "hidden");

				warning
				.text("No protein domain information.")
				.css("font-size", "25px")
				.css("padding-top", "100px")
				.css("text-align", "center");
				return;
			}
			else {
				visible_set.css("visibility", "visible");
			}
		}

		var getSamePositionList = function(_public_list)    {
			var result = [];

			for(var i = 0, len = _public_list.length ; i < len ; i++)		{
				var item = _public_list[i];

				if($.inArray(item.position, result) < 0) {
					result.push(item.position);
				}
			}
			return result;
		}

		var getMaximumY = function() {
			var public_list = getSamePositionList(_data.data.public_list || _data.data.sample_list);
			var result = 0;

			for(var i = 0, len = public_list.length ; i < len ; i++)	{
				var item = public_list[i];

				(result > _utils.getObjectArray(item, _data.data.public_list || _data.data.sample_list, "position").length) 
				? result = result : result = _utils.getObjectArray(item, _data.data.public_list || _data.data.sample_list, "position").length;
			}
			return result + 1;
		}

		var reformData = function()    {
			var same_pos_list = getSamePositionList(_data.data.public_list || _data.data.sample_list);
			var result = [];
			var result2 = [];
			var aachange_array = [];

			for(var i = 0, len = same_pos_list.length ; i < len ; i++)	{
				var item = same_pos_list[i];
				var obj = _utils.getObjectArray(item, _data.data.public_list || _data.data.sample_list, "position");
				var sub_result = [];
				
				aachange_array.push(typeSet(obj));

				for(var j = 0, leng = obj.length ; j < leng ; j++)	{
					var jtem = obj[j];

					sub_result = reformJson(jtem, sub_result);
				}
				result2.push({ 
					position : item, 
					public_list : typeSet(obj)
				});
				result.push({ 
					position : item, 
					public_list : sub_result
				});
			}

			// console.log(result, aachange_array);
			// console.log(makeStack(result2))
			// console.log(result, result2);
			return makeStack(result2);

			// return makeStack(result);
		}

		var typeSet = function(_obj)	{
			var result = [];

			for(var i = 0, len = _obj.length ; i < len ; i++)	{
				var item = _obj[i];
				var is_aachange = _utils.getObject(item.aachange, result, "aachange");
				var is_type = _utils.getObject(item.type, result, "type");

				if(is_aachange && is_type)	{
					is_aachange.count += 1;
				}
				else {
					result.push({
						id : item.id,
						type : item.type,
						position : item.position,
						aachange : item.aachange,
						count : 1
					});
				}
			}
			return result;
		}

		var reformJson = function(_e, _result)   {
			var result = _result || [];
			var already_type = _utils.getObject(_e.type, result, "type");

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

		var aachangeObj = function(_typeset)	{
			var result = [];

			for(var i = 0, len = _typeset.length ; i < len ; i++)	{
				var item = _typeset[i];

				for(var j = 0, leng = item.aachange.length ; j < leng ; j++)	{
					var aachange = item.aachange[j];
					var id = item.id[j];
					var is_aachange = _utils.getObject(aachange, result, "aachange");

					if(!is_aachange)	{
						result.push({
							id : id,
							type : item.type,
							position : item.position,
							aachange : aachange,
							count : 1
						});
					}
					else {
						is_aachange.count += 1;
					}
				}
			}
			return result;
		}

		var makeStack = function(_array)  {
			for(var i = 0, len = _array.length ; i < len ; i++)	{
				var item = _array[i];

				for(var j = 0, leng = item.public_list.length ; j < leng ; j++)	{
					var jtem = item.public_list[j];

					if(j === 0)	{
						jtem.y = 0;
					}
					else {
						jtem.y = item.public_list[j - 1].count + item.public_list[j - 1].y;
					}
				}
			}
			return _array;
		}

		var getMutationName = function() {
			var result = [];
			var list = _data.data.public_list || _data.data.sample_list;

			for(var i = 0, len = list.length ; i < len ; i++)	{
				var item = list[i];

				if($.inArray(_utils.defMutName(item.type), result) < 0)  {
					result.push(_utils.defMutName(item.type));
				}
			}
			return { 
				type_list : result 
			};
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
		checkProtein();
		// filtered();

		var ymax = getMaximumY();
		var stacked = reformData();

		_utils.removeSvg(".needleplot_view_yaxis");
		_utils.removeSvg(".needleplot_view");

		_setting_legend({
			data : getMutationName(),
			view_id : "needleplot_legend",
			type : "generic mutation",
			chart : "needleplot"
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

		$("#testbutton")
		.on("click", function()	{
			_utils.downloadImage("variants", "png");
			_utils.downloadImage("variants", "pdf");
		})
	}
});