define("analysis/needleplot/navigation/setting_needlenavigation", ["utils", "size", "analysis/needleplot/navigation/view_needlenavigation"], function(_utils, _size, _view)	{
	return function(_data, _stacked, _ymax) 	{
		var size = _size.initSize("needleplot_navigation", 10, 20, 20, 0, { "graph_width" : 20 });
		
		_utils.removeSvg(".needleplot_navigation");

		_view.view({
			data : _data,
			stacked : _stacked,
			size : size,
			x : _utils.linearScale(0, _data.data.graph[0].length, size.margin.left, size.rwidth),
			y : _utils.linearScale(0, _ymax, size.height, 0)
		});
	}
});