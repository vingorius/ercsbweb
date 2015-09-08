var XY = "xyplot/";

define(XY + "setting_xyplot", ["utils", "size", XY + "view_xyplot"], function(_utils, _size, _view)	{
	var get_max = function(_type, _list)	{
		return d3.max(_list.map(function(_d)	{ return _d[_type]; })) + 1;
	}

	var get_min = function(_type, _list)	{
		return d3.min(_list.map(function(_d)	{ return _d[_type]; })) - 1;
	}

	return function(_data)	{
		var data = _data || [];
		var size = _size.initSize("xyplot_view", 20, 20, 20, 20);
		var radius = 3;

		var xmax = get_max("x", data.data.plot_list);
		var xmin = get_min("x", data.data.plot_list);
		var ymax = get_max("y", data.data.plot_list);
		var ymin = get_min("y", data.data.plot_list);

		var x = _utils.linearScale(xmin, xmax, (size.margin.left + size.margin.right), size.rwidth)
		.clamp(true);
		var y = _utils.linearScale(ymin, ymax, size.rheight, size.margin.top)
		.clamp(true);

		  _utils.removeSvg("xyplot_view");

		_view.view({
			data : data,
			size : size,
			max : { x : xmax, y : ymax },
			min : { x : xmin, y : ymin },
			radius : radius,
			x : x,
			y : y
		});
	}
});