define("pcaplot2d/setting_pcaplot2d", ["utils", "size", "pcaplot2d/view_pcaplot2d"], function(_utils, _size, _view)	{
	return function(_data, _min_max, _type_list)	{
		var data = _data || [];
		var min_max = _min_max || new Function();
		var size = _size.define_size("pcaplot_view_2d", 40, 40, 40, 40);
		var radius = 5;

		var x_minmax = min_max(data, "PC1");
		var y_minmax = min_max(data, "PC2");

		var x = _utils.linearScale(x_minmax.min, x_minmax.max,
			size.margin.left, size.rwidth);
		var y = _utils.linearScale(y_minmax.min, y_minmax.max, 
			size.rheight, size.margin.top);

		_view.view({
			data : data,
			size : size,
			type : _type_list,
			x : x,
			y : y,
			radius : radius
		});
	}
});