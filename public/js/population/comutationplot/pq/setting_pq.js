define("population/comutationplot/pq/setting_pq", ["utils", "size", "population/comutationplot/pq/view_pq"], function(_utils, _size, _view)	{
	var getOnlyPQ = function(_symbol_list)	{
		var result = [];

		for(var i = 0, len = _symbol_list.length ; i < len ; i++)	{
			var symbol = _symbol_list[i];

			result.push({
				gene : symbol.gene,
				list : [ symbol ]
			});
		}
		return result;
	}

	var getLogMax = function(_data)	{
		return d3.max(_data.map(function(_d)	{
			var result = 0;
			
			for(var i = 0, len = _d.list.length ; i < len ; i++)	{
				var data = _d.list[i].q || _d.list[i].p;
				
				(_utils.calLog(data) > result) ? result = _utils.calLog(data) : result = result;
			}
			return result;
		}));
	}

	var dataSet = function()	{
		return {
			data : arguments[0],
			size : arguments[1],
			max : arguments[2],
			x : arguments[3],
			y : arguments[4],
			title_size : arguments[5] ? arguments[5] : undefined,
		};
	}

	return function(_symbol_list, _genes)	{
		var pq_data = getOnlyPQ(_symbol_list);
		var max = Math.ceil(getLogMax(pq_data));
		var size = _size.initSize("comutationplot_pq", 0, 20, 20, 20);
		var x = _utils.linearScale(0, max, size.margin.left, (size.width - size.margin.right));
		var y = _utils.ordinalScale(_genes, 0, (size.height - size.margin.bottom));

		_utils.removeSvg("comutationplot_pq");

		_view.view(dataSet(pq_data, size, max, x, y));
		_view.titleView(dataSet(pq_data, size, max, x, y, _size.initSize("comutationplot_pq_title", 20, 20, 20, 20)));
	}
});