var DEG = "degplot/";

define(DEG + "setting_degplot", ["utils", "size", DEG + "view_degplot"], function(_utils, _size, _view)	{
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
			"#466D1C", "#6C1C1D", "#2F3B4B",
			"#7A7510", "#7C4C0E", "#474343",
			"#54116E", "#170A75"
		];
	}

	var rgb = function(_color) 	{
		return d3.rgb(_color).hsl();
	}

	var background_color = function(_rgb, _value, _min, _max)	{
		if(_value > _max)	{
			_value = _max;
		}

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
		var tbody = _utils.getClass("degplot_tbody");
		var si = count_si(data.data.pathway_list[0]);
		var si_min_max = [];

		for(var i = 0, len = si.length ; i < len ; i++)	{
			var a_si = {};
			_utils.defineProp(a_si, max(data.data.pathway_list, si[i]), "max");
			_utils.defineProp(a_si, min(data.data.pathway_list, si[i]), "min");
			si_min_max.push(_utils.defineProp({}, a_si, si[i]));
		}

		_view.view({
			data : data.data.pathway_list, 
			tbody : tbody,
			backgroundcolor : background_color,
			colors : color_list,
			max : max,
			min : min,
			si : si,
			min_max : si_min_max
		});
	}
});	