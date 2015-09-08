var GENE = "population/comutationplot/gene/";
var SORT = "population/comutationplot/sort_comutationplot";

define( GENE + "setting_gene", ["utils", "size", (GENE + "view_gene"), SORT], function(_utils, _size, _view, _sort)	{
	return function(_data, _genes)	{
		var count_gene = _sort.countOrder(_data.data.mutation_list, "gene");
		var size = _size.initSize("comutationplot_gene", 0, 20, 20, 70);
		var title_size = _size.initSize("comutationplot_gene_title", 20, 20, 20, 20);
		var max = Math.ceil(_utils.getObjectMax(count_gene, "counts") / 10) * 10;
		var x = _utils.linearScale(0, max, (size.width - size.margin.right), size.margin.left);
		var y = _utils.ordinalScale(_genes, 0, (size.height - size.margin.bottom));

		_utils.removeSvg("comutationplot_gene");

		_view.view({
			data : count_gene,
			size : size,
			max : max,
			x : x,
			y : y
		});
		_view.titleView({
			data : count_gene,
			size : size,
			title_size : title_size,
			max : max,
			x : x,
			y : y
		});
	}
});