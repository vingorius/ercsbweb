define("pq/setting_pq", ["utils", "size", "pq/view_pq"], function(_utils, _size, _view)	{
	var get_pq = function(_symbol_list)	{
		var symbol_list = _symbol_list || [];
		var result = [];

		for(var i = 0, len = symbol_list.length ; i < len ; i++)	{
			result.push({
				name : symbol_list[i].name,
				list : [symbol_list[i]]
			});
		}

		return result;
	}

	var get_max = function(_data)	{
		var data = _data || [];

		return d3.max(data.map(function(_d)	{
			var result = 0;

			for(var i = 0, len = _d.list.length ; i < len ; i++)	{
				(_utils.log(_d.list[i].q) > result) ?
					result = _utils.log(_d.list[i].q) : result = result;
			}

			return result;
		}));
	}

	return function(_symbol_list, _genes)	{
		var symbol_list = _symbol_list || [];
		var genes = _genes || [];
		var pq_data = get_pq(symbol_list);
		var max = get_max(pq_data);
		var size = _size.define_size("comutationplot_pq", 10, 20, 10, 70);
		var x = _utils.linearScale(0, max, size.margin.left, (size.width - size.margin.right));
		var y = _utils.ordinalScale(genes, size.margin.top, (size.height - size.margin.bottom));

		_utils.remove_svg("comutationplot_pq");

		_view.view({
			data : pq_data,
			size : size,
			x : x, 
			y : y
		})
	}
});