var COMUTS_NAVI = "population/comutationplot/navigation/";

define(COMUTS_NAVI + "setting_comutationnavigation", ["utils", "size", COMUTS_NAVI + "view_comutationnavigation"], function(_utils, _size, _view)	{
	return function()	{
		$("#comutationplot_scale").height($("#comutationplot_groups").height() + 5);
		var size = _size.initSize("mutation_view_navigation", 0, 0, 0, 0);
		size.magnification = 2;
		size.left_between = 1.5;
		size.top_between = 1.2;

		_view.view({
			size : size
		});
	}
});