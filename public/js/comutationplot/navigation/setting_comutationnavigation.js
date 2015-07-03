define("comutationnavigation/setting_comutationnavigation", ["utils", "size", "comutationnavigation/view_comutationnavigation"], function(_utils, _size, _view)	{
	return function(_samples, _genes)	{
		var samples = _samples || [];
		var genes = _genes || [];
		var size = _size.define_size("mutation_view_navigation", 10, 10, 20, 20);

		_view.view({
			samples : samples,
			genes : genes,
			size : size
		})
	}
});