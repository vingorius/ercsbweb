var GENE = "population/comutationplot/gene/";

define( GENE + "setting_gene", ["utils", "size", (GENE + "view_gene")], function(_utils, _size, _view)	{
	var count_by_order = function(_all_data, _importance)	{
		var gene_list = [];

		for(var i = 0, len = _all_data.data.mutation_list.length ; i < len ; i++)	{
			var gene = _all_data.data.mutation_list[i];
			var is_gene = _utils.get_json_in_array(gene.gene, gene_list, "gene");

			if(!is_gene)	{
				gene_list.push({
					gene : gene.gene,
					types : [{ type : gene.type, count : 1 }],
					counts : 1
				});
			}
			else {
				var is_type = _utils.get_json_in_array(gene.type, is_gene.types, "type");

				if(!is_type)	{ is_gene.types.push({ type : gene.type, count : 1 }); }
				else { is_type.count += 1; }

				is_gene.counts += 1;
			}
		}
		return stacked(gene_list, _importance);
	}

	var stacked = function(_gene_list, _importance)  {
		for(var i = 0, len = _gene_list.length ; i < len ; i++)	{
			var stack_gene = _gene_list[i];
			stack_gene.types = sort_by_mutation(stack_gene.types, _importance);

			for(var j = 0, leng = stack_gene.types.length ; j < leng ; j++)	{
				var type = stack_gene.types[j];

				if(j === 0)    { type.start = 0; }
				else {
					var pre_type = stack_gene.types[j - 1];
					type.start = pre_type.count + pre_type.start;
				}
			}
		}
		return _gene_list;
	}

	var sort_by_mutation = function(_types, _importance)	{
		return _types.sort(function(_a, _b)	{
			return (_importance.indexOf(_a.type) < _importance.indexOf(_b.type)) ? 1 : -1
		});
	}

	var get_max = function(_count_gene)	{
		return d3.max(_count_gene.map(function(_d) {
			return _d.counts;
		}));
	}

	return function(_data, _genes, _importance)	{
		var count_gene = count_by_order(_data, _importance);
		var size = _size.define_size("comutationplot_gene", 20, 20, 20, 70);
		var max = Math.ceil(get_max(count_gene) / 10) * 10;

		_utils.remove_svg("comutationplot_gene");

		_view.view({
			data : count_gene,
			size : size,
			max : max,
			x : _utils.linearScale(0, max, (size.width - size.margin.right), size.margin.left), 
			y : _utils.ordinalScale(_genes, size.margin.top, (size.height - size.margin.top))
		});
	}
});