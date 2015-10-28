define("population/comutationplot/navigation/setting_comutationnavigation", ["utils", "size", "population/comutationplot/navigation/view_comutationnavigation"], function(_utils, _size, _view)	{
	return function()	{
		$("#comutationplot_scale").height($("#comutationplot_groups").height() + 5);

		_view.view({
			size : _size.initSize("mutation_view_navigation", 0, 0, 0, 0)
		});
	}
});