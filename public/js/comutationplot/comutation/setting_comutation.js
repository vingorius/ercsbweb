define("comutation/setting_comutation"
	, ["utils", "size", "comutation/view_comutation"]
	, function(_utils, _size, _view)	{
		return function(_all_data, _samples, _genes)	{
			var all_data = _all_data || [];
			var samples = _samples || [];
			var genes = _genes || [];

			var size = _size.define_size("comutationplot_heatmap", 20, 20, 20, 20);

			_utils.remove_svg("comutationplot_heatmap");

			var x = _utils.ordinalScale(samples, size.margin.left, size.width - size.margin.left);
			var y = _utils.ordinalScale(genes, size.margin.top, (size.height - size.margin.top));

			_view.view({
				all_data : all_data,
				samples : samples,
				genes : genes,
				size : size,
				x : x,
				y :y
			});
		}
	});