var REQUIRE = [
	"utils", "size", "population/comutationplot/vo_comutationplot", "population/comutationplot/group/setting_group", 
	"population/comutationplot/comutation/setting_comutation", "population/comutationplot/gene/setting_gene",
	"population/comutationplot/pq/setting_pq", "population/comutationplot/sample/setting_sample",
	"population/comutationplot/navigation/setting_comutationnavigation", "chart/legend/setting_legend", "population/comutationplot/sort_comutationplot"
];

define("population/comutationplot/interface_comutationplot", REQUIRE, function(_utils, _size, _VO, _setting_group, _setting_comutation, _setting_gene, _setting_pq, _setting_sample, _setting_comutationnavigation, _setting_legend, _sort)	{
	var getOnlyGeneSampleName = function(_key, _list)	{
		var result = [];
		var top_index = 0;

		for(var i = 0, len = _list.length ; i < len ; i++)	{
			var item = _list[i][_key];
			if($.inArray(item, result) < 0)	{
				result[top_index] = item;
				// result.push(item);
				top_index++;
			}
		}
		return result;
	}

	var getSettingData = function(_key, _list)		{
		var result = [];

		for(var i = 0, len = _list.length ; i < len ; i++)	{
			var item = _list[i];

			settingData(item, result, _key);
		}
		return result;
	}

	var settingData = function(_item, _array, _type)		{
		var is_datas = _utils.getObject(_item[_type], _array, _type);
		var oppsite_type = _type === "sample" ? "gene" : "sample";

		if(!is_datas)	{
			_array.push({
				sample : _type === "sample" ? _item.sample : [ _item.sample ],
				gene : _type === "sample" ? [ _item.gene ] : _item.gene,
				type : [ _item.type ]
			});
		}
		else {
			is_datas[oppsite_type].push(_item[oppsite_type]);
			is_datas.type.push(_item.type);	
		}
		return _array;
	}

	var getOnlyMutations = function(_mutation_list)  {
		var result = { type_list : [] };
		var top_index = 0;

		for(var i = 0, len = _mutation_list.length ; i < len ; i++)	{
			var type = _utils.defMutName(_mutation_list[i].type);
			var type_list = result.type_list;

			if($.inArray(type, type_list) < 0 && type)	{
				type_list[top_index] = type;
				top_index++;
				// type_list.push(type);
			}
		}
		return result;
	}

	var defAreaSize = function(_length, _data)	{
		var init = $("#comutationplot_heatmap");
		var rect_size = 4.6;
		var top_between = 1 + +((_length / init.width()).toFixed(2) / 2);
		var new_width = +((rect_size * _length).toFixed(0));

		_VO.VO.setInitWidth(new_width);
		_VO.VO.setInitHeight(init.height());
		_VO.VO.setWidth(new_width);
		_VO.VO.setHeight(init.height());
		_VO.VO.setTopBetween(top_between);

		$("#comutationplot_heatmap").width(_VO.VO.getWidth());
		$("#comutationplot_border, #comutationplot_groups, #comutationplot_sample, #comutationplot_legend_empty").width(new_width > 1100 ? 1100 : new_width);
	}

	var makeNAgroup = function(_sample_list)	{
		var result = [{ name : "NA", data : [] }];

		for(var i = 0, len = _sample_list.length ; i < len ; i++)	{
			var item = _sample_list[i];
			
			result[0].data[i] = { sample : item.sample, value : "NA" };
			// result[0].data.push({
			// 	sample : item.sample,
			// 	value : "NA"
			// });
		}
		return result;
	}

	return function(_data)	{
		var vo = _VO.VO;
		var patient_list = (_data.data.patient_list.length < 1) ? [] : getSettingData("sample", _data.data.patient_list);
		var gene_names = getOnlyGeneSampleName("gene", _data.data.gene_list);
		vo.setInitGene(gene_names);
		vo.setGene(gene_names);
		var mutations = getOnlyMutations(_data.data.mutation_list);
		vo.setFormatedData({ gene : getSettingData("gene", _data.data.mutation_list), sample : getSettingData("sample", _data.data.mutation_list) });
		var group_list = _data.data.group_list.length > 0 ? _data.data.group_list : makeNAgroup(vo.getFormatedData().sample);
		var grouped = _sort.grouped(group_list, vo.getFormatedData().sample);
		var merged_group = grouped.merge;
		var exclusive_group = _sort.loopingGroup(grouped.spread);
		var sample_names = getOnlyGeneSampleName("sample", exclusive_group);

		vo.setMutation(mutations.type_list);
		vo.setInitSample(sample_names);
		vo.setSample(sample_names);

		defAreaSize(sample_names.length, _data.data.mutation_list);

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
	};
});