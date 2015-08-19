var COMUTS_INTER = "population/comutationplot/interface_comutationplot";
var VO = "population/comutationplot/vo_comutationplot";
var GROUP = "population/comutationplot/group/";
var COMUTATION = "population/comutationplot/comutation/";
var GENE = "population/comutationplot/gene/";
var SAMPLE = "population/comutationplot/sample/";
var PQ = "population/comutationplot/pq/";
var COMUTS_NAVI = "population/comutationplot/navigation/";
var SORT = "population/comutationplot/sort_comutationplot";
var LEGEND = "chart/legend/setting_legend";

define(COMUTS_INTER, [ "utils", VO, GROUP + "setting_group", COMUTATION + "setting_comutation", GENE + "setting_gene", PQ + "setting_pq", SAMPLE + "setting_sample", COMUTS_NAVI + "setting_comutationnavigation", LEGEND, SORT ], function(_utils, _VO, _setting_group, _setting_comutation, _setting_gene, _setting_pq, _setting_sample, _setting_comutationnavigation, _setting_legend, _sort)	{
	/* get only gene or sample make for axis and nessecery for sorting mutation */
	var getOnlyGeneSampleName = function(_key, _list)	{
		var result = [];

		for(var i = 0, len = _list.length ; i < len ; i++)	{
			var item = _list[i][_key];
			if($.inArray(item, result) < 0)	{
				result.push(item);
			}
		}
		return result;
	}
	var getOnlyGeneSampleData = function(_list)	{
		var gene_datas = [];
		var sample_datas = [];

		for(var i = 0, len = _list.length ; i < len ; i++)	{
			var item = _list[i];
			var is_gene_datas = _utils.get_json_in_array(item.gene, gene_datas, "gene");
			var is_sample_datas = _utils.get_json_in_array(item.sample, sample_datas, "sample");

			if(!is_gene_datas)	{
				gene_datas.push({
					gene : item.gene,
					sample : [ item.sample ],
					type : [ item.type ]
				});
			}
			else {
				is_gene_datas.sample.push(item.sample);	
				is_gene_datas.type.push(item.type);
			}
			if(!is_sample_datas)	{
				sample_datas.push({
					sample : item.sample,
					gene : [ item.gene ],
					type : [ item.type ]
				});
			}
			else {
				is_sample_datas.gene.push(item.gene);
				is_sample_datas.type.push(item.type);
			}
		}
		return {
			gene : gene_datas,
			sample : sample_datas
		}
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
		return result;
	}

	var formatedPatient = function(_patient_list)	{
		var result = [];

		for(var i = 0, len = _patient_list.length ; i < len ; i++)	{
			var patient = _patient_list[i];
			var is_patient = _utils.get_json_in_array(patient.sample, result, "sample");

			if(!is_patient)	{
				result.push({
					sample : patient.sample,
					gene : [ patient.gene ],
					type : [ patient.type ]
				});
			}
			else {
				is_patient.gene.push(patient.gene);
				is_patient.type.push(patient.type);
			}
		}
		return result;
	}
	
	var addPatientToMutation = function(_mutation_list, _patient_list)	{
		for(var i = 0, len = _patient_list.length ; i < len ; i++)	{
			var patient = _patient_list[i];

			_mutation_list.unshift(patient);
		}
		return _mutation_list;
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
	return function(_data)	{
		var vo = _VO.VO;
		var gene_list = _data.data.gene_list;
		var patient_list = formatedPatient(_data.data.patient_list);
		var mutation_list = addPatientToMutation(_data.data.mutation_list, _data.data.patient_list);
		vo.setInitPatient(patient_list);
		vo.setPatient(patient_list);
		var gene_names = getOnlyGeneSampleName("gene", gene_list);
		var samples = getOnlyGeneSampleName("sample", mutation_list);
		vo.setInitGene(gene_names);
		vo.setGene(gene_names);
		var mutations = getOnlyMutations(mutation_list);
		vo.setInitMutation(mutations.type_list);
		vo.setMutation(mutations.type_list);
		var importance = mutation_importance(_data, mutations);
		var importance_name = importance_by_name(importance);
		vo.setFormatedData(getOnlyGeneSampleData(mutation_list));
		var exclusive_sample = _sort.exclusiveGroup(vo.getFormatedData().sample, samples.length);
		var sample_names = _sort.spliceAndUnshiftExclusive(getOnlyGeneSampleName("sample", exclusive_sample));
		vo.setInitSample(sample_names);
		vo.setSample(sample_names);

		var groups = _sort.group(_data.data.group_list[0].data, _data.data.group_list[0].data, vo.getFormatedData().sample);	

		_utils.remove_svg("comutationplot_legend");

		_setting_group(_data.data.group_list, vo.getFormatedData().sample);
		_setting_comutation(mutation_list, sample_names, gene_names);
		_setting_gene(_data, gene_names, importance_name);
		_setting_pq(gene_list, gene_names);
		_setting_sample(mutation_list, sample_names, importance_name);
		_setting_comutationnavigation(sample_names, gene_names);
		_setting_legend(mutations, "comutationplot_legend", null, importance);
	};
});