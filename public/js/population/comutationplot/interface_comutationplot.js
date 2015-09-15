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

			makeGene(item, gene_datas);
			makeSample(item, sample_datas);
		}
		return {
			gene : gene_datas,
			sample : sample_datas
		}
	}

	var makeGene = function(_item, _array)	{
		var is_gene_datas = _utils.getObject(_item.gene, _array, "gene");

		if(!is_gene_datas)	{
			_array.push({
				gene : _item.gene,
				sample : [ _item.sample ],
				type : [ _item.type ]
			});
		}
		else {
			is_gene_datas.sample.push(_item.sample);	
			is_gene_datas.type.push(_item.type);
		}
		return _array;
	}

	var makeSample = function(_item, _array)		{
		var is_sample_datas = _utils.getObject(_item.sample, _array, "sample");

		if(!is_sample_datas)	{
			_array.push({
				sample : _item.sample,
				gene : [ _item.gene ],
				type : [ _item.type ]
			});
		}
		else {
			is_sample_datas.gene.push(_item.gene);
			is_sample_datas.type.push(_item.type);	
		}
		return _array;
	}

	var getOnlyMutations = function(_mutation_list)  {
		var result = { type_list : [] };

		for(var i = 0, len = _mutation_list.length ; i < len ; i++)	{
			var type = _utils.defMutName(_mutation_list[i].type);
			var type_list = result.type_list;

			if($.inArray(type, type_list) < 0 && type)	{
				type_list.push(type);
			}
		}
		return result;
	}

	var formatedPatient = function(_patient_list)	{
		var result = [];

		for(var i = 0, len = _patient_list.length ; i < len ; i++)	{
			var patient = _patient_list[i];
			var is_patient = _utils.getObject(patient.sample, result, "sample");

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

	var loopingGroup = function(_group_list)	{
		var target_list;

		for(var i = 0, len = _group_list.length ; i < len ; i++)		{
			var group = _group_list[i];
			if(i === 0)	{
				target_list = _sort.group(group, group, _VO.VO.getFormatedData().sample);
			}
			else {
				var ex = [];
				for(var j = 0, leng = target_list.length ; j < leng ; j++)	{
					var target = target_list[j];
					$.merge(ex, _sort.group(target, group, _VO.VO.getFormatedData().sample));
				}
				target_list = ex;
			}
		}
		return loopingExclusive(target_list);
	}

	var loopingExclusive = function(_separate)	{
		var result = [];

		for(var i = 0, len = _separate.length ; i < len ; i++)	{
			var separate = _separate[i];
			var ex = _sort.exclusiveGroup(separate, separate.length);

			$.merge(result, ex);
		}
		return result;
	}
	
	return function(_data)	{
		var vo = _VO.VO;
		var patient_list = (_data.data.patient_list.length < 1) ? [] : formatedPatient(_data.data.patient_list);
		var gene_names = getOnlyGeneSampleName("gene", _data.data.gene_list);
		vo.setInitGene(gene_names);
		vo.setGene(gene_names);
		var mutations = getOnlyMutations(_data.data.mutation_list);
		vo.setFormatedData(getOnlyGeneSampleData(_data.data.mutation_list));
		var exclusive_defalut_grouping = _sort.grouping(_data.data.group_list, vo.getFormatedData().sample);
		var looped_group = loopingGroup(exclusive_defalut_grouping);
		var sample_names = getOnlyGeneSampleName("sample", looped_group);

		vo.setMutation(mutations.type_list);
		vo.setInitSample(sample_names);
		vo.setSample(sample_names);

		_utils.removeSvg("comutationplot_legend");	

		_setting_comutation(_data.data.mutation_list, _data.data.patient_list, sample_names, gene_names);
		_setting_gene(_data, gene_names);
		_setting_pq(_data.data.gene_list, gene_names);
		_setting_group(_data.data.group_list, _data.data.patient_list, vo.getFormatedData().sample);
		_setting_sample(_data.data.mutation_list, _data.data.patient_list, sample_names);
		_setting_comutationnavigation();
		_setting_legend({
			data : mutations,
			view_id : "comutationplot_legend",
			type : "generic mutation",
			chart : "comutation",
		});

		$("#testbutton")
		.on("click", function()	{
			console.log(_data, _data.data, _data.data.name)
			_utils.downloadImage("comutation", "png");
			_utils.downloadImage("comutation", "pdf");
		})
	};
});