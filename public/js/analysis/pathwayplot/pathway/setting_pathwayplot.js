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

	var addTooltipInfoJs =function()	{
		var script = document.createElement("script")
		script.src = "/js/analysis/pathwayplot/pathway/test.js";
		var head = document.querySelector("head");
		var is_js = document.querySelector("script[src*=test]");
		
		if(is_js === null)	{
			head.appendChild(script);
		}
	}

	return function(_data)	{
		addTooltipInfoJs();

		_view.view({
			data : _data.data,
			g : findGeneRects(d3.selectAll("g[id*='gene_']")[0])
		});

				$("#testbutton")
		.on("click", function()	{
			_utils.downloadImage("pathway", "png");
			_utils.downloadImage("pathway", "pdf");
		})
	}
});