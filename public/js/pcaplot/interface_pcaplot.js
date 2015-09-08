var PCA = "pcaplot/interface_pcaplot";
var _2D = "pcaplot/pca2d/setting_pcaplot2d";
var _3D = "pcaplot/pca3d/setting_pcaplot3d";
var LEGEND = "chart/legend/setting_legend";

define(PCA, ["utils", "size", LEGEND, _2D, _3D], function(_utils, _size, _setting_legend, _setting_2d, _setting_3d)	{
	var exchangeTsv = function(_data)  {
		return lineFeedTsv(_data, tabSeparateTsv);
	}

	var lineFeedTsv = function(_data, _callback)   {
		var linefeed_reg = /\n/g;

		return {
			title : "pca_plot",
			sample_list : _callback(_data.split(linefeed_reg))
		};
	}

	var tabSeparateTsv = function(_linefeed)  {
		var tab_separate_reg = /\t/g;
		var linefeed = _linefeed || [];
		var keys = linefeed[0].split(tab_separate_reg);

		var result = [];

		for(var i = 1, len = linefeed.length - 1 ; i < len ; i++)   {
			result.push(tabSeparateJson(keys, linefeed[i].split(tab_separate_reg)));
		}
		return result;
	}

	var tabSeparateJson = function(_keys, _values)    {
		var keys = _keys || [];
		var values = _values || [];

		var result = {};

		for(var i = 0, len = keys.length ; i < len ; i++)   {
			result[keys[i].replace(/"/g, '')] = (values[i] || "").replace(/"/g, '');
		}
		return result;
	}

	var getTypeList = function(_data)	{
		var result = [];

		for(var i = 0, len = _data.length ; i < len ; i++)	{
			var is_type = _utils.getObject(_data[i].TYPE, result, "name");

			if(!is_type)	{
				result.push({
					name : _data[i].TYPE
				});
			}
		}
		return { 
			type_list :  result 
		};
	}

	var minAndmax = function(_data, _axis)  {
		var add_axis = 10;

		var min = d3.min(_data.sample_list.map(function(_d)    { 
			return Number(_d[_axis]); 
		}));
		var max = d3.max(_data.sample_list.map(function(_d)    { 
			return Number(_d[_axis]); 
		}));

		return {
			min : min - add_axis,
			max : max + add_axis
		};
	 }

	 var figureList = function(_type)	{
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
		var data = exchangeTsv(_data || []);
		var type_list = getTypeList(data.sample_list);
		var canvas = $("canvas");

		_utils.removeSvg("pcaplot_view_2d");
		_utils.removeSvg("pcaplot_legend");

		if(!!canvas)	{ 
			canvas.remove(); 
		}
		_setting_legend({
			data : type_list,
			view_id : "pcaplot_legend",
			type : "pca mutation",
			chart : "pcaplot",
		});

		if(window.location.pathname.indexOf("3d") > 0)	{
			_setting_3d(data, minAndmax, figureList);	
		}
		_setting_2d(data, minAndmax, figureList);
	}
});