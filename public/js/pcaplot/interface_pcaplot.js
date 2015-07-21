var PCA = "pcaplot/interface_pcaplot";
var _2D = "pcaplot/pca2d/setting_pcaplot2d";
var _3D = "pcaplot/pca3d/setting_pcaplot3d";
var LEGEND = "legend/setting_legend";

define(PCA, ["utils", "size", LEGEND, _2D, _3D], function(_utils, _size, _setting_legend, _setting_2d, _setting_3d)	{
	var exchange_tsv = function(_data)  {
		var data = _data || "";
		var linefeed_data = linefeed_tsv(data, tab_separate_tsv);

		return linefeed_data;
	}

	var linefeed_tsv = function(_data, _callback)   {
		var linefeed_reg = /\n/g;
		var callback = _callback || Function;

		return {
			title : "pca_plot",
			sample_list : callback(_data.split(linefeed_reg))
		};
	}

	var tab_separate_tsv = function(_linefeed)  {
		var tab_separate_reg = /\t/g;
		var linefeed = _linefeed || [];
		var keys = linefeed[0].split(tab_separate_reg);

		var result = [];

		for(var i = 1, len = linefeed.length - 1 ; i < len ; i++)   {
			result.push(tab_separate_json(keys
				, linefeed[i].split(tab_separate_reg)));
		}
		return result;
	}

	var tab_separate_json = function(_keys, _values)    {
		var keys = _keys || [];
		var values = _values || [];

		var result = {};

		for(var i = 0, len = keys.length ; i < len ; i++)   {
			console.log();
			result[keys[i].replace(/"/g, '')] = (values[i] || "").replace(/"/g, '');
		}
		return result;
	}

	var get_type_list = function(_data)	{
		var result = [];

		for(var i = 0, len = _data.length ; i < len ; i++)	{
			if($.inArray(_data[i].TYPE, result) < 0)	{
				result.push(_data[i].TYPE);
			}
		}

		return {
			type_list :  result
		};
	}

	var mutation_importance = function(_data)	{
		var result = [];

		for (var i = 0, len = _data.length ; i < len ; i++)	{
			var type = _utils.get_json_in_array(_data[i].TYPE, result, "name");
			if(type)	{
				type.importance += 1;
			}
			else {
				result.push({ name : _data[i].TYPE, importance : 0 });
			}
		}
		return result;
	}

	var min_max = function(_data, _axis)  {
		var add_axis = 10;

		var min = d3.min(_data.sample_list.map(function(_d)    { return Number(_d[_axis]); }));
		var max = d3.max(_data.sample_list.map(function(_d)    { return Number(_d[_axis]); }));

		return {
			min : min - add_axis,
			max : max + add_axis
		};
	 }

	 var figure_list = function(_type)	{
		return {
			"Primary Solid Tumor" : {
				figure : "circle"
			},
			"Solid Tissue Normal" : {
				figure : "rect"
			}
		}[_type];
	}

	return function(_data)	{
		var data = exchange_tsv(_data || []);
		var type_list = get_type_list(data.sample_list);
		var canvas = $("canvas");
		var importance = mutation_importance(data.sample_list);

		_utils.remove_svg("pcaplot_view_2d");
		_utils.remove_svg("pcaplot_legend");

		if(!!canvas)	{ canvas.remove(); }

		_setting_legend(type_list, "pcaplot_legend", figure_list, importance);

		if(window.location.pathname.indexOf("3d") > 0)	{
			_setting_3d(data, min_max, figure_list);	
		}
		_setting_2d(data, min_max, figure_list);
	}
});