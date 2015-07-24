var COMUTS_INTER = "comutationplot/interface_comutationplot";
var VO = "comutationplot/vo_comutationplot";
var COMUTATION = "comutationplot/comutation/";
var GENE = "comutationplot/gene/";
var SAMPLE = "comutationplot/sample/";
var PQ = "comutationplot/pq/";
var COMUTS_NAVI = "comutationplot/navigation/";
var LEGEND = "legend/setting_legend";

define(COMUTS_INTER, [ "utils", VO, COMUTATION + "setting_comutation", GENE + "setting_gene", PQ + "setting_pq", SAMPLE + "setting_sample", COMUTS_NAVI + "setting_comutationnavigation", LEGEND ], function(_utils, _VO, _setting_comutation, _setting_gene, _setting_pq, _setting_sample, _setting_comutationnavigation, _setting_legend)	{
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

		if(index > samples.length - 1)  {  return;  }

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

	var define_groups = function(_group_list)	{
		var group_array = [];

		for(var i = 0, len = _group_list.length ; i < len ; i++)	{
			var name = _utils.defineProp({}, _group_list[i], "group_name");
			_utils.defineProp(name, [], "group_list");

			group_array.push(name);
		}
		return group_array;
	}

	var group_by_sample = function(_data, _group_list)	{
		var group_array = define_groups(_group_list);

		for(var i = 0, len = _data.length ; i < len ; i++)	{
			var group = _utils.get_json_in_array(_data[i].sample_group, group_array, "group_name");
			if(group)	{
				group.group_list.push(_data[i]);
			}
		}
		return group_array;
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
			}
		});
		return result;
	}

	var define_mutations = function(_mutation_list)	{
		var mutation_array = [];

		for(var i = 0, len = _mutation_list.length ; i < len ; i++)	{
			var mutations = _utils.defineProp({}, _mutation_list[i], "name");
			_utils.defineProp(mutations, 0, "importance");
			mutation_array.push(mutations);
		}
		return mutation_array;
	}

	var mutation_importance = function(_all, _mutation_list)	{
		var mutations = define_mutations(_mutation_list.type_list);

		for (var i = 0, len = _all.length ; i < len ; i++)	{
			for(var j = 0, leng = _all[i].type.length ; j < leng ; j++)	{
				var mutation = _utils.get_json_in_array(_all[i].type[j], mutations, "name");
				if(mutation)	{
					mutation.importance += 1;
				}
			}
		}

		return mutations.sort(function(_a, _b)	{
			return (_a.importance > _b.importance) ? 1 : -1;
		});
	}

	var importance_by_name = function(_importance)	{	
		var result = [];
	
		for(var i = 0, len = _importance.length ; i < len ; i++)	{
			result.push(_importance[i].name);
		}
		return result;
	}

	return function(_data)	{
		var data = _data || [];

		var sample_list = data.data.sample_list;
		var symbol_list = data.data.symbol_list;

		var genes = get_list_by_key("name", symbol_list);
		var samples = get_list_by_key("name", sample_list);
		var mutations = get_mutation_list(sample_list);

		_VO.VO.setInitSample(samples);
		_VO.VO.setInitGene(genes);

		_VO.VO.setSample(samples);
		_VO.VO.setGene(genes);

		var all_data = get_all_data(sample_list, samples);
		var importance = mutation_importance(all_data, mutations);
		var importance_name = importance_by_name(importance);
		var groups = group_by_sample(all_data, data.data.group_list);

		_utils.remove_svg("comutationplot_legend");

		_setting_comutation(all_data, samples, genes, data);
		_setting_gene(all_data, genes, importance_name);
		_setting_pq(data.data.symbol_list, genes);
		_setting_sample(all_data, samples, importance_name);
		_setting_comutationnavigation(samples, genes);
		_setting_legend(mutations, "comutationplot_legend", null, importance);
	};
});