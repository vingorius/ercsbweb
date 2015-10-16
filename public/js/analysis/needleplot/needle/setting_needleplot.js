define("analysis/needleplot/needle/setting_needleplot", ["utils", "size", "analysis/needleplot/needle/view_needleplot", "chart/legend/setting_legend", "analysis/needleplot/navigation/setting_needlenavigation"], function(_utils, _size, _view, _setting_legend, _setting_navigation)   {
	return function(_data)  {
		var size = _size.initSize("needleplot_view", 20, 40, 20, 0, { "graph_width" : 20 });

		var checkProtein = function()	{
			var main_view = $("#needleplot_view");
			var visible_set = $("#needleplot_navigation, #needleplot_legend");

			if(main_view.text().length > 0)	{
				main_view.text("");
			}
			
			if(Object.keys(_data.data.graph).length === 0)	{
				visible_set.css("visibility", "hidden");

				main_view
				.text("No protein domain information.")
				.css("font-size", "25px")
				.css("padding-top", "100px")
				.css("text-align", "center");
				return;
			}
			else {
				visible_set
				.css("visibility", "visible");
				main_view
				.css("padding-top", "0px")
				.css("height", "400px");

				size = _size.initSize("needleplot_view", 20, 40, 20, 0, { "graph_width" : 20 });
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

			for(var i = 0, len = same_pos_list.length ; i < len ; i++)	{
				var item = same_pos_list[i];
				var obj = _utils.getObjectArray(item, _data.data.public_list || _data.data.sample_list, "position");

				result.push({ 
					position : item, 
					public_list : setType(obj)
				});
			}
			return makeStack(result);
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
			var patient = _data.data.patient_list;

			for(var i = 0, len = list.length ; i < len ; i++)	{
				var item = list[i];

				if($.inArray(_utils.defMutName(item.type), result) < 0)  {
					result.push(_utils.defMutName(item.type));
				}
			}

			for(var j = 0, leng = patient.length ; j < leng ; j++)	{
				var jtem = patient[j].type;

				for(var k = 0, lengt = jtem.length ; k < lengt ; k++)	{
					var ktem = _utils.defMutName(jtem[k]);

					if($.inArray(ktem, result) < 0)	{
						result.push(ktem);
					}
				}
			}
			return { 
				type_list : result 
			};
		} 

		var setRadius = function(_count) {
			return Math.sqrt(_count) * 3;
		} 

		var setFontSize = function()	{
			return (10).toFixed(0) + "px";
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

		var data = combinePatient(_data);
		var ymax = getMaximumY();
		var stacked = reformData();

		_utils.removeSvg(".needleplot_legend");
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
	}
});