define( "gene/setting_gene", ["utils", "size", "gene/view_gene"], function(_utils, _size, _view)	{
	var count_by_order = function(_all_data)	{
		var all_data = _all_data || [];
		var gene_list = [];

		for(var i = 0, len = all_data.length ; i < len ; i++)	{
			var check = _utils.get_json_in_array(all_data[i].gene, gene_list, "name");
			if(!check)	{
				gene_list.push({
					name : all_data[i].gene,
					gene_group : all_data[i].gene_group,
					list : [all_data[i]]
				});
			}
			else {
				check.list.push(all_data[i]);
			}
		}

		return stacked(counting(gene_list));
	}

	var counting = function(_list)	{
		var list = _list || [];

		for(var i = 0, len = list.length ; i < len ; i++)	{
			list[i].list = count_mutation(list[i].list);
		}

		return list;
	}

	var count_mutation = function(_mutation)    {
		var mutation = _mutation || [];
		var result = [];

		for(var i = 0, len = mutation.length ; i < len ; i++)   {
			for(var j = 0, lens = mutation[i].type.length ; j < lens ; j++) {
				var check = _utils.get_json_in_array(mutation[i].type[j], result, "type");

				if(!check) {
					result.push({
						gene : [mutation[i].gene],
						type : mutation[i].type[j],
						count : 1,
					});
				}
				else {
					if($.inArray(mutation[i].gene, check.gene) < 0)    {
						check.gene.push(mutation[i].gene);
					}
					check.count += 1;
				}
			}
		}   

		return result;
	}

	var stacked = function(_data)  {
		var data = _data || [];

		data.map(function(_d)   {
			$.each(_d.list, function(_i)    {
				if(_i === 0)    {
					_d.list[_i].start = 0;
				}
				else {
					_d.list[_i].start = _d.list[_i - 1].count + _d.list[_i - 1].start;
				}
			});
		});

		return data;
	}

	var get_max = function(_data)	{
		var data = _data || [];

		return d3.max(data.map(function(_d) {
			var result = 0;

			for(var i = 0, len = _d.list.length ; i < len ; i++)	{
				result += _d.list[i].count;
			}

			return result;
		}));
	}

	return function(_all_data, _genes)	{
		var all_data = _all_data || [];
		var genes = _genes || [];
		var count_gene = count_by_order(all_data);
		var size = _size.define_size("comutationplot_gene", 10, 15, 10, 70);
		var max = get_max(count_gene);

		_utils.remove_svg("comutationplot_gene");

		var x = _utils.linearScale(0, max, (size.width - size.margin.right), size.margin.left);
		var y = _utils.ordinalScale(genes, size.margin.top, (size.height - size.margin.bottom));

		_view.view({
			data : count_gene,
			size : size,
			x : x, 
			y : y
		});
	}
});