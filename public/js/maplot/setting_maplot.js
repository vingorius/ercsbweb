define("maplot/setting_maplot", ["utils", "size", "maplot/view_maplot"], function(_utils, _size, _view)	{
	var max_min = function(_data, _axis)  {
		var min = d3.min(_data.data.plot_list.map(function(_d)    { return _d[_axis]; }))
		max = d3.max(_data.data.plot_list.map(function(_d)    { return _d[_axis]; }));

		return {
			min : min,
			max : max
		};
	}

	var point_color = function(_d, _cut_off)	{
		return _d.color = (_d.value < _cut_off) ? "red" : "#333333";
	}

	return function(_data)	{
		var data = _data || [];
		var size = _size.define_size("maplot_view", 20, 20, 20, 20);
		var cut_off = data.data.cutoff_value;
		var x_buf = 1;
		var y_buf = 1;

		_utils.remove_svg("maplot_view");
		$("#maplot_result_view").show();

		var x = _utils.linearScale(max_min(data, "x").min - x_buf, max_min(data, "x").max + x_buf,
			(size.margin.left + size.margin.right), size.rwidth);
		var y = _utils.linearScale(max_min(data, "y").max + y_buf, max_min(data, "y").min - y_buf,
			size.margin.top, size.rheight);
		
		_view.view({
			data : data,
			cut_off : cut_off,
			size : size,
			x : x,
			y : y,
			color : point_color
		})
	}
})