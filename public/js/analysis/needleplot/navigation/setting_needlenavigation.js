var NEEDLE_NAVI = "analysis/needleplot/navigation/";

define(NEEDLE_NAVI + "setting_needlenavigation", ["utils", "size", NEEDLE_NAVI + "view_needlenavigation"], function(_utils, _size, _view)	{
	return function(_data, _stacked, _ymax) 	{
		var size = _size.definitionSize("needleplot_navigation", 10, 20, 20, 0);
		
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