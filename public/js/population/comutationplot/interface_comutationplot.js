// 'use strict';
var REQUIRE = [
	"utils", "size", "population/comutationplot/vo_comutationplot", "population/comutationplot/group/setting_group", 
	"population/comutationplot/comutation/setting_comutation", "population/comutationplot/gene/setting_gene",
	"population/comutationplot/pq/setting_pq", "population/comutationplot/sample/setting_sample",
	"population/comutationplot/navigation/setting_comutationnavigation", "chart/legend/setting_legend", "population/comutationplot/sort_comutationplot"
];
define("population/comutationplot/interface_comutationplot", REQUIRE, function(_utils, _size, _VO, _setting_group, _setting_comutation, _setting_gene, _setting_pq, _setting_sample, _setting_comutationnavigation, _setting_legend, _sort)	{
	var getSettingData = function(_type, _sample_list)	{
		var result = [];
		var index = 0, index_object = {};
		var opposite = _type === "sample" ? "gene" : "sample";

		_sample_list.filter(function(_d)	{
			if(typeof index_object[_d[_type]] !== "undefined")	{
				var target = result[index_object[_d[_type]]];
				
				target[opposite].push(_d[opposite]);
				target.type.push(_d.type);
			}
			else {
				result[index] = {
					sample : _type === "sample" ? _d.sample : [_d.sample],
					gene : _type === "sample" ? [_d.gene] : _d.gene,
					type : [_d.type],
				};
				index_object[_d[_type]] = index++;
			}
		});
		return result;
	}

	var defAreaSize = function(_length, _data)	{
		var init = $("#comutationplot_heatmap");
		var new_width = +((4.6 * _length).toFixed(0));

		_VO.VO.setInitWidth(new_width);
		_VO.VO.setWidth(new_width);
		_VO.VO.setInitHeight(init.height());
		_VO.VO.setHeight(init.height());
		_VO.VO.setTopBetween((1 + +((_length / init.width()).toFixed(2) / 2)));

		$("#maincontent").css('min-width', $(".chart_container").width() + 50);
		$("#comutationplot_heatmap").width(_VO.VO.getWidth());
		$("#comutationplot_border, #comutationplot_groups, #comutationplot_sample, #comutationplot_legend_empty")
		.width(new_width > 1100 ? 1100 : new_width);
	}

	var makeNAgroup = function(_sample_list)	{
		var result = [{ name : "NA", data : [] }];

		for(var i = 0, len = _sample_list.length ; i < len ; i++)	{
			result[0].data[i] = { sample : _sample_list[i].sample, value : "NA" };
		}
		return result;
	}

	return function(_data)	{
		var geng_name_list = _utils.getNotExistDataInObjArray(_data.data.gene_list, "gene");
		var mutation_list = _utils.getNotExistDataInObjArray(_data.data.mutation_list, "type", _utils.mutate, "name");

		_VO.VO.setInitGene(geng_name_list);
		_VO.VO.setGene(geng_name_list);		
		_VO.VO.setFormatedData({ 
			gene : getSettingData("gene", _data.data.mutation_list), 
			sample : getSettingData("sample", _data.data.mutation_list) 
		});
		var group_list = _data.data.group_list.length > 0 ? _data.data.group_list : makeNAgroup(_VO.VO.getFormatedData().sample);
		var grouped = _sort.loopingGroup(_sort.grouped(group_list, _VO.VO.getFormatedData().sample).spread);
		var sample_name_list = _utils.getNotExistDataInObjArray(grouped, "sample");

		_VO.VO.setMutation(mutation_list.type_list);
		_VO.VO.setInitSample(sample_name_list);
		_VO.VO.setSample(sample_name_list);
		defAreaSize(sample_name_list.length, _data.data.mutation_list);

		_setting_comutation(_data.data.mutation_list, _data.data.patient_list, sample_name_list, geng_name_list);
		_setting_gene(_data, geng_name_list);
		_setting_pq(_data.data.gene_list, geng_name_list);
		_setting_group(_data.data.group_list, _data.data.patient_list, _VO.VO.getFormatedData().sample);
		_setting_sample(_data.data.mutation_list, _data.data.patient_list, sample_name_list);
		_setting_comutationnavigation();
		_setting_legend({
			data : { type_list : mutation_list },
			view_id : "comutationplot_legend",
			type : "generic mutation",
			chart : "comutation",
		});
	};
});