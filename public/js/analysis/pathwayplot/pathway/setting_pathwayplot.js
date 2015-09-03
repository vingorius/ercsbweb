var PATHWAY = "analysis/pathwayplot/pathway/"

define(PATHWAY + "setting_pathwayplot", ["utils", "size", PATHWAY + "view_pathwayplot"], function(_utils, _size, _view)   {
	var findGeneRects = function(_all_rects)	{
		var result = [];

		for(var i = 0, len = _all_rects.length ; i < len ; i++)	{
			var rect = d3.select(_all_rects[i]);

			result.push(rect);
		}
		return result;
	}

	return function(_data)	{
		_view.view({
			data : _data.data,
			g : findGeneRects(d3.selectAll("g[id*='gene_']")[0]),
			gradient : d3.select("#gradient_frequency")
		});
	}
});