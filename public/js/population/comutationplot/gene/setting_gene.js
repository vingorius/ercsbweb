var GENE = "population/comutationplot/gene/";

define( GENE + "setting_gene", ["utils", "size", (GENE + "view_gene")], function(_utils, _size, _view)	{
	var count_by_order = function(_all_data)	{
		var gene_list = [];

		for(var i = 0, len = _all_data.data.mutation_list.length ; i < len ; i++)	{
			var gene = _all_data.data.mutation_list[i];
			var type = _utils.definitionMutationName(gene.type);
			var is_gene = _utils.getObjInArray(gene.gene, gene_list, "gene");

			if(!is_gene)	{
				gene_list.push({
					gene : gene.gene,
					types : [{ type : type, count : 1 }],
					counts : 1
				});
			}
			else {
				var is_type = _utils.getObjInArray(type, is_gene.types, "type");

				if(!is_type)	{ is_gene.types.push({ type : type, count : 1 }); }
				else { is_type.count += 1; }

				is_gene.counts += 1;
			}
		}
		return stacked(gene_list);
	}

	var stacked = function(_gene_list)  {
		for(var i = 0, len = _gene_list.length ; i < len ; i++)	{
			var stack_gene = _gene_list[i];
			stack_gene.types = sort_by_mutation(stack_gene.types);

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

	var sort_by_mutation = function(_types)	{
		return _types.sort(function(_a, _b)	{
			var a = _utils.alterationPrecedence(_utils.definitionMutationName(_a.type));
			var b = _utils.alterationPrecedence(_utils.definitionMutationName(_b.type));

			var a_priority = a.alteration === "CNV" ? a.priority + 20 : a.priority;
			var b_priority = b.alteration === "CNV" ? b.priority + 20 : b.priority;

			return (a_priority < b_priority) ? 1 : -1
		});
	}

	var get_max = function(_count_gene)	{
		return d3.max(_count_gene.map(function(_d) {
			return _d.counts;
		}));
	}

	return function(_data, _genes)	{
		var count_gene = count_by_order(_data);
		var size = _size.definitionSize("comutationplot_gene", 0, 20, 20, 70);
		var title_size = _size.definitionSize("comutationplot_gene_title", 20, 20, 20, 20);
		var max = Math.ceil(get_max(count_gene) / 10) * 10;
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