define("degplot/setting_degplot", ["utils", "size", "degplot/view_degplot"], function(_utils, _size, _view)	{
	var max = function(_log_list, _key)	{
		return d3.max(_log_list.map(function(_d)	{
			return _d[_key];
		}));
	}

	var min = function(_log_list, _key)	{
		return d3.min(_log_list.map(function(_d)	{
			return _d[_key];
		}));
	}

	var getClass = function(_id)	{
		for (var i = 0, len = document.getElementsByTagName("*").length ; i < len ; i++)	{
			if(document.getElementsByTagName("*")[i].className === _id)	{
				return document.getElementsByTagName("*")[i];
			}
		} 
	}

	var rgb = function(_color) 	{
		return d3.rgb(_color).hsl();
	}

	var background_color = function(_rgb, _value, _min, _max)	{
		var si_color_scale = d3.scale.linear()
		.domain([_max, _min])
		.range([0, 4]);

		return rgb(_rgb).brighter(si_color_scale(_value));
	}

	var count_si = function(_data)	{
		var keys = Object.keys(_data);
		var result = [];

		for(var i = 0, len = keys.length ; i < len ; i++)	{
			if((/si/i).test(keys[i]))	{
				result.push(keys[i]);
			}
		}
		
		return result;
	}

	return function(_data)	{
		var data = _data || [];
		var tbody = getClass("degplot_tbody");
		var si = count_si(data.data.pathway_list[0]);
		var si_max = max(data.data.pathway_list, "si_log_p");
		var si_down_max = max(data.data.pathway_list, "si_down_log_p");
		var si_up_max = max(data.data.pathway_list, "si_up_log_p");
		var si_min = min(data.data.pathway_list, "si_log_p");
		var si_down_min = min(data.data.pathway_list, "si_down_log_p");
		var si_up_min = min(data.data.pathway_list, "si_up_log_p");

		_view.view({
			data : data.data.pathway_list, 
			tbody : tbody,
			backgroundcolor : background_color,
			max : max,
			min : min,
			si : si,
			si_log_p : {
				max : si_max,
				min : si_min
			},
			si_up_log_p : {
				max : si_up_max,
				min : si_up_min
			},
			si_down_log_p : {
				max : si_down_max,
				min : si_down_min
			},
		});
	}
});	