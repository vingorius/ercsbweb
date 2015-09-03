var _2D = "pcaplot/pca2d/";

define(_2D + "setting_pcaplot2d", ["utils", "size", _2D + "view_pcaplot2d"], function(_utils, _size, _view)	{
	return function(_data, _min_max, _type_list)	{
		var size = _size.definitionSize("pcaplot_view_2d", 40, 40, 40, 40);
		var x_minmax = _min_max(_data, "PC1");
		var y_minmax = _min_max(_data, "PC2");
		var x = _utils.linearScale(x_minmax.min, x_minmax.max,
			size.margin.left, size.rwidth);
		var y = _utils.linearScale(y_minmax.min, y_minmax.max, 
			size.rheight, size.margin.top);

		_view.view({
			data : _data,
			size : size,
			type : _type_list,
			x : x,
			y : y,
			radius : 5
		});
	}
});