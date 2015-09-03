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

	var colour = function()	{
		return [
			"#ea3b29", "#f68d3b", "#f2ee7e",
			"#5cb755", "#3e87c2", "#252766",
			"#955fa7", "#a5a5a5"
		];
	}

	var hsl = function(_color) 	{
		return d3.hsl(_color);
	}

	var backgroundColor = function(_rgb, _value, _min, _max)	{
		if(_value > _max)	{
			_value = _max;
		}
		var hsl_color = hsl(_rgb);
		var si_color_scale = d3.scale.linear()
		.domain([_max, _min])
		.range([hsl_color.l, 1]);

		hsl_color.l = si_color_scale(_value);

		return hsl_color;
	}

	var countSi = function(_data)	{
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
		var si = countSi(_data.data.pathway_list[0]);
		var si_min_max = [];

		for(var i = 0, len = si.length ; i < len ; i++)	{
			var a_si = {};
			_utils.defineProp(a_si, max(_data.data.pathway_list, si[i]), "max");
			_utils.defineProp(a_si, min(_data.data.pathway_list, si[i]), "min");
			si_min_max.push(_utils.defineProp({}, a_si, si[i]));
		}

		_view.view({
			data : _data.data.pathway_list, 
			tbody : document.querySelector(".degplot_tbody"),
			backgroundcolor : backgroundColor,
			colors : colour,
			max : max,
			min : min,
			si : si,
			min_max : si_min_max
		});
	}
});	