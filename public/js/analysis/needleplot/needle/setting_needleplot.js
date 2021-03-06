'use strict';
define("analysis/needleplot/needle/setting_needleplot", ["utils", "size", "analysis/needleplot/needle/view_needleplot", "chart/legend/setting_legend", "analysis/needleplot/navigation/setting_needlenavigation"], function(_utils, _size, _view, _setting_legend, _setting_navigation)   {
	return function(_data)  {
		var size = _size.initSize("needleplot_view", 20, 40, 20, 0, { "graph_width" : 20 });

		var checkProtein = function()	{
			if(Object.keys(_data.data.graph).length === 0)	{
				setViewArea({"visibility" : "hidden"}, "No protein domain information.",
				 {"font-size" : "25px", "padding-top" : "100px" , "text-align" : "center"});
				return;
			}
			setViewArea({"visibility" : "visible"}, "", {"padding-top" : "0px", "height" : "400px"});

			size = _size.initSize("needleplot_view", 20, 40, 20, 0, { "graph_width" : 20 });
		}

		var setViewArea = function(_visible_css, _main_text, _main_css)	{
			$("#needleplot_navigation, #needleplot_legend")
			.css(_visible_css);
			$("#needleplot_view")
			.text(_main_text)
			.css(_main_css);
		}

		var setRadius = function(_count) {
			return Math.sqrt(_count) * 3;
		} 

		var reformData = function(_list)    {
			var same_pos_list = _utils.getNotExistDataInObjArray(_list, "position");
			var sum_result = 0;
			var result = [];

			for(var i = 0, len = same_pos_list.length ; i < len ; i++)	{
				var item = same_pos_list[i];
				var obj = _utils.getObject(item, _data.data.public_list || _data.data.sample_list, "position", true);

				(sum_result > obj.length) ? sum_result = sum_result : sum_result = obj.length;

				result.push({ 
					position : item, 
					public_list : setType(obj)
				});
			}
			return {
				max : sum_result + 1,
				stack : _utils.stacked(result, "public_list"),
			};
		}

		var setType = function(_obj)	{
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

		var combinePatient = function(_data)	{
			var result = [];

			for(var i = 0, len = _data.data.patient_list.length ; i < len ; i++)	{
				var item = _data.data.patient_list[i];
				var is_aachange = _utils.getObject(item.aachange, result, "aachange");
				
				if(!is_aachange)	{
					item.count = 1;
					item.type = [ item.type ];
					result.push(item);
				}
				else {
					if(is_aachange.position === item.position)	{
						if($.inArray(item.type, is_aachange.type) < 0)	{
							is_aachange.type.push(item.type);
						}	
						is_aachange.count += 1;
					}
					else {
						item.count = 1;
						item.type = [ item.type ];
						result.push(item);
					}
				}
			}
			_data.data.patient_list = result;
			return _data;
		}
		checkProtein();

		var public_list = _data.data.public_list || _data.data.sample_list;
		var mutation_list = _utils.getNotExistDataInObjArray($.merge(public_list, _data.data.patient_list), "type", _utils.mutate, "name");
		var data = combinePatient(_data);
		var reform = reformData(public_list);

		_utils.removeSvg(".needleplot_legend", ".needleplot_view");
		
		_setting_legend({
			data : { type_list : mutation_list },
			view_id : "needleplot_legend",
			type : "generic mutation",
			chart : "needleplot"
		});
		_view.view({
			data : data,
			stacked : reform.stack,
			size : size,
			x : _utils.linearScale(0, _data.data.graph[0].length, size.margin.left, size.rwidth).clamp(true),
			y : _utils.linearScale(reform.max, 0, size.margin.top, (size.rheight - size.graph_width)).clamp(true),
			ymax : reform.max,
			radius : setRadius,
		});
		_setting_navigation(_data, reform.stack, reform.max);
	}
});