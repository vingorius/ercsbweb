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

	var color_list = function()	{
		return [
			[ "#466627", "#6C1C1D", "#42536A", "#AD987B", "#6C1C6D", "#CC383B", "#85BC4E", "#682727" ],
			[ "#C20037", "#37C200", "#0037C2", "#D5FF3D", "#8B00C2", "#C28B00", "#00C28B", "#673DFF" ],
			[ "#1672A7", "#A71672", "#72A716", "#D44FE8", "#16A794", "#9416A7", "#A79416", "#A71629" ],
			[ "#E92F39", "#2FE9E0", "#0F558F", "#8F890F", "#158F0F", "#0F158F", "#8F0F55", "#8F490F" ],
			[ "#DB0F5D", "#5DDB0F", "#0F5DDB", "#DB8D0F", "#C4DB0F", "#8D0FDB", "#0FDB8D", "#DB270F" ],
			[ "#D33641", "#D37A36", "#D3C836", "#8FD336", "#368FD3", "#3641D3", "#7A36D3", "#E99BA0" ],
			[ "#B53F21", "#188162", "#DB5939", "#39BADB", "#811837", "#6C8118", "#621881", "#378118" ],
			[ "#F1B037", "#3778F1", "#A2220B", "#0BA222", "#DB940F", "#A20B8C", "#0B8CA2", "#A26D0B" ]
		];
	}

	var rgb = function(_color) 	{
		return d3.rgb(_color).hsl();
	}

	var background_color = function(_rgb, _value, _min, _max)	{
		var si_color_scale = d3.scale.linear()
		.domain([_max, _min])
		.range([0, 4]);

		// console.log(_utils.opposite_color(_rgb.substring(_rgb.indexOf("#") + 1, _rgb.length)));
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
		var tbody = _utils.getClass("degplot_tbody");
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
			colors : color_list,
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