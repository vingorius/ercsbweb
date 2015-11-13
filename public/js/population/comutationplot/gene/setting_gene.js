// 'use strict';
define("population/comutationplot/gene/setting_gene", ["utils", "size", "population/comutationplot/gene/view_gene", "population/comutationplot/sort_comutationplot"], function(_utils, _size, _view, _sort)	{
	var dataSet = function()	{
		var set = {
			data : arguments[0],
			size : arguments[1],
			x : arguments[2],
			y : arguments[3],
		};
		typeof arguments[4] === "number" ? set.max = arguments[4] : set.title_size = arguments[4];
		return set;
	}

	return function(_data, _genes)	{
		var count_gene = _sort.countOrder(_data.data.mutation_list, "gene");
		var size = _size.initSize("comutationplot_gene", 0, 20, 20, 70);
		var max = Math.ceil(_utils.getObjectMax(count_gene, "counts") / 10) * 10;
		var x = _utils.linearScale(0, max, (size.width - size.margin.right), size.margin.left);
		var y = _utils.ordinalScale(_genes, 0, (size.height - size.margin.bottom));

		_utils.removeSvg("comutationplot_gene");

		_view.view(dataSet(count_gene, size, x, y, max));
		_view.titleView(dataSet(count_gene, size, x, y, _size.initSize("comutationplot_gene_title", 20, 20, 20, 20)));
	}
});