define( "interface_comutation", [ "utils", "comutation/setting_comutation", "gene/setting_gene", "pq/setting_pq", "sample/setting_sample", "comutationnavigation/setting_comutationnavigation", "legend/setting_legend" ], function(_utils, _setting_comutation, _setting_gene, _setting_pq, _setting_sample, _setting_comutationnavigation, _setting_legend)	{
	var get_list_by_key = function(_key, _list)	{
		var list = _list || [], result = [];
		var key = _key || "name";

		for(var i = 0, len = list.length ; i < len ; i++)   {
			if($.inArray(list[i][key], result) < 0 && list[i][key])   {
				result.push(list[i][key]);
			}
		}
		return result;
	}

	var get_all_data = function(_sample_list, _samples, _index, _result)  {
		var sample_list = _sample_list || [], samples = _samples || [], result = _result || [];
		var sampleColumn, aberrations;
		var index = _index || 0;

		if(index > samples.length - 1)  { 
			return; 
		}

		sampleColumn = _utils.search_in_jsonarray(samples[index], "name", sample_list);

		sampleColumn.gene_list.forEach(function(_d, _i)  {
			aberrations = get_all_aberration_list(_d);
			result.push({
				sample_group : sampleColumn.group,
				gene_group : "group",
				sample : sampleColumn.name,
				gene : _d.name,
				type : aberrations.type,
				value : aberrations.value,
			});
		})
		get_all_data(sample_list, samples, index += 1, result);

		return result;
	}

	var get_all_aberration_list = function(_gene) {
		var gene = _gene.aberration_list || [];
		var result = { type : [], value : [] };

		gene.forEach(function(_d, _i)   {
			if($.inArray(_utils.define_mutation_name(_d.type), result.type) < 0)    {
				result.type.push(_utils.define_mutation_name(_d.type));
			}
			result.value.push(_d.value);
		});
		return result;
	}

	var get_mutation_list = function(_list, _result)  {
		var list = _list || [];
		var typeName = "";
		var result = _result || { type_list : [], value_list : [] };

		list.map(function(_d, _i)   {
			if(_utils.check_array_in_json(_d))  {
				get_mutation_list(_utils.get_array_in_json(_d)[0], result);
			}
			else {
				typeName = _utils.define_mutation_name(_d.type);

				if($.inArray(typeName, result.type_list) < 0) { result.type_list.push(typeName); }
				if($.inArray(_d.value, result.value_list) < 0) { result.value_list.push(_d.value); }
			}
		});
		return result;
	}

	return function(_data)	{
		var data = _data || [];

		var sample_list = data.data.sample_list;
		var symbol_list = data.data.symbol_list;

		var genes = get_list_by_key("name", symbol_list);
		var samples = get_list_by_key("name", sample_list);
		var mutations = get_mutation_list(sample_list);

		var all_data = get_all_data(sample_list, samples);

		_utils.remove_svg("comutationplot_legend");

		_setting_comutation(all_data, samples, genes);
		_setting_gene(all_data, genes);
		_setting_pq(data.data.symbol_list, genes);
		_setting_sample(all_data, samples);
		_setting_comutationnavigation(samples, genes);
		_setting_legend(mutations, "comutationplot_legend");
	};
});