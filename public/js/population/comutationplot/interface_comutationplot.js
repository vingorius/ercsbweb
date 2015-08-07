var COMUTS_INTER = "population/comutationplot/interface_comutationplot";
var VO = "population/comutationplot/vo_comutationplot";
var COMUTATION = "population/comutationplot/comutation/";
var GENE = "population/comutationplot/gene/";
var SAMPLE = "population/comutationplot/sample/";
var PQ = "population/comutationplot/pq/";
var COMUTS_NAVI = "population/comutationplot/navigation/";
var SORT = "population/comutationplot/sort_comutationplot";
var LEGEND = "chart/legend/setting_legend";

define(COMUTS_INTER, [ "utils", VO, COMUTATION + "setting_comutation", GENE + "setting_gene", PQ + "setting_pq", SAMPLE + "setting_sample", COMUTS_NAVI + "setting_comutationnavigation", LEGEND, SORT ], function(_utils, _VO, _setting_comutation, _setting_gene, _setting_pq, _setting_sample, _setting_comutationnavigation, _setting_legend, _sort)	{
	/* get only gene or sample make for axis and nessecery for sorting mutation */
	var getOnlyGeneSample = function(_key, _list)	{
		var result = [];

		for(var i = 0, len = _list.length ; i < len ; i++)	{
			var item = _list[i][_key];
			if($.inArray(item, result) < 0)	{
				result.push(item);
			}
		}
		// console.log("only " + _key + " list : ", result, " is length : ", result.length);
		return result;
	}
	/* after get mutation,it makes mutation list */
	var getOnlyMutations = function(_mutation_list)  {
		var result = { type_list : [] };

		for(var i = 0, len = _mutation_list.length ; i < len ; i++)	{
			var type = _utils.define_mutation_name(_mutation_list[i].type);
			var type_list = result.type_list;
			if($.inArray(type, type_list) < 0)	{
				type_list.push(type);
			}
		}
		// console.log("only mutation list : ", result);
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

	var sort_by_groupname = function(_groups)	{
		if(_groups.length < 2)	{
			return _groups[0].group_list;
		}
		/* Should be write sorting logic here */

		return _groups[0].group_list;
	}
	/* ========================== Mutation Importance start ===========================  */
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
	/* Stacked value sequance by importance of sample / gene name */
	var importance_by_name = function(_importance)	{	
		var result = [];

		for(var i = 0, len = _importance.length ; i < len ; i++)	{
			result.push(_importance[i].name);
		}
		return result;
	}
	/* ========================== Mutation Importance end ===========================  */

	var importanceValueOfGene = function(_symbol_list)	{
		var importanceGene = {};

		for(var i = 0, len = _symbol_list.length ; i < len ; i++)	{
			importanceGene[_symbol_list[i].name] = i + 1;
		}
		return importanceGene;
	}

	var importanceValueOfType = function(_type_list)	{
		var mappingType = {
			"Nonsense" : 3,
			"Synonymous" : 6,
			"Splice_Site" : 2,
			"Frame_shift_indel" : 1,
			"In_frame_indel" : 4,
			"Missense" : 5
		};
		var typeStr = makeStrArray(mappingType);

		for(var i = 0, len = _type_list.length ; i < len ; i++)	{
			typeStr[mappingType[_type_list[i].type] - 1] = 0;
		}
		return typeStr.join("");
	}

	var makeStrArray = function(_mapping)	{
		var result = [];

		for(var i = 0, len = Object.keys(_mapping).length ; i < len ; i++)	{
			result.push("1");
		}
		return result;
	}

	var makeImportanceGeneStr = function(_gene_list, _mapping)	{
		var geneStr = makeStrArray(_mapping);

		for(var i = 0, len = _gene_list.length ; i < len ; i++)	{
			var gene = _gene_list[i];
			var typeStr = importanceValueOfType(gene.aberration_list);
			var mappingGene = _mapping[gene.name];
			gene.sort_str = typeStr;
			gene.aberration_list.sort(function(_a, _b)	{
				return (_a.sort_text  > _b.sort_text) ? 1 : -1;
			})
			geneStr[mappingGene - 1] = 0;
		}
		return geneStr.join("");
	}	

	var initialSort = function(_data)	{
		var mappingGene = importanceValueOfGene(_data.symbol_list);

		for(var i = 0, len = _data.sample_list.length ; i < len ; i++)	{
			var sample = _data.sample_list[i];
			var geneStr = makeImportanceGeneStr(sample.gene_list, mappingGene);
			sample.sort_text = geneStr;
			console.log(geneStr)
		}
		_data.sample_list.sort(function(_a, _b)	{
			return (_a.sort_text > _b.sort_text) ? 1 : -1;
		});
		return _data;
	}

	return function(_data)	{
		// var presortdata = initialSort(_data.data);

		// var sample_list = presortdata.sample_list;
		// var symbol_list = presortdata.symbol_list;
		var vo = _VO.VO;
		var mutation_list = _data.data.mutation_list;
		var gene_list = _data.data.gene_list;

		var genes = getOnlyGeneSample("gene", gene_list);
		var samples = getOnlyGeneSample("sample", mutation_list);
		var mutations = getOnlyMutations(mutation_list);

		vo.setInitSample(samples);
		vo.setInitGene(genes);
		vo.setSample(samples);
		vo.setGene(genes);

		var importance = mutation_importance(_data, mutations);
		var importance_name = importance_by_name(importance);

		var groups = _sort.group(_data.data.group_list[0].data, vo.getInitSample());		// now first parameter is user selected array but maybe it will be change after by conditions
		console.log(groups);		
		// var groups = group_by_sample(_data, _data.data.group_list);
		// var after_sort_groups = sort_by_groupname(groups);

		_utils.remove_svg("comutationplot_legend");

		// _setting_comutation(after_sort_groups, samples, genes, _data);
		// _setting_gene(_data, genes, importance_name);
		// _setting_pq(gene_list, genes);
		// _setting_sample(after_sort_groups, samples, importance_name);
		// _setting_comutationnavigation(samples, genes);
		_setting_legend(mutations, "comutationplot_legend", null, importance);
	};
});