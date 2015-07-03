define("needleplotnavigation/setting_needlenavigation", ["utils", "size", "needleplotnavigation/view_needlenavigation"], function(_utils, _size, _view)	{
	return function(_data, _stacked, _ymax) 	{
		var data = _data || [];
		var stacked = _stacked || [];
		var ymax = _ymax;
		var size = _size.define_size("needleplot_navigation", 10, 10, 20, 20);

		var x = _utils.linearScale(0, data.data.graph[0].length, (size.margin.left * 2), size.rwidth);
		var y = _utils.linearScale(0, ymax, size.height, 0);

		_utils.remove_svg("needleplot_navigation");

		_view.view({
			data : data,
			stacked : stacked,
			size : size,
			x : x,
			y : y
		})
	}
});