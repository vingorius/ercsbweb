var VO = "population/comutationplot/vo_comutationplot";

define(VO, ["utils"], function(_utils)	{
	var VO = (function()	{
		var init_sample = [];
		var init_gene = [];
		var sample_list = [];
		var formated_data = [];
		var gene_list = [];
		var mutation_list = [];
		var sort_order = [];
		var init_layout_width = 0;
		var init_layout_height = 0	
		var layout_width = 0;
		var layout_height = 0	

		return {
			setInitSample : function(_init_sample) 	{
				init_sample = _init_sample;
			},
			setSample : function(_sample_list) 	{
				sample_list = _sample_list;
			},
			setFormatedData : function(_formated_data)	{
				formated_data = _formated_data;
			},
			setInitGene : function(_init_gene) 	{
				init_gene = _init_gene;
			},
			setGene : function(_gene_list) {
				gene_list = _gene_list;
			},
			setMutation : function(_mutation_list)	{
				mutation_list = _mutation_list;
			},
			setSortOrder : function(_sort_order)	{
				sort_order = _sort_order;
			},
			setInitWidth : function(_init_layout_width)	{
				init_layout_width = _init_layout_width;
			},
			setInitHeight : function(_init_layout_height)	{
				init_layout_height = _init_layout_height;
			},	
			setWidth : function(_layout_width)	{
				layout_width = _layout_width;
			},
			setHeight : function(_layout_height)	{
				layout_height = _layout_height;
			},	
			getInitSample : function()	   {	
				return init_sample;
			},
			getInitGene : function()	{
				return init_gene;
			},
			getSample : function()	   {
				return sample_list;
			},
			getFormatedData : function()	{
				return formated_data;
			},
			getGene : function()	{
				return gene_list;
			},
			getMutation : function()	{
				return mutation_list;
			},
			getSortOrder : function()	{
				return sort_order;
			},
			getInitWidth : function()	{
				return init_layout_width;
			},
			getInitHeight : function()	{
				return init_layout_height;
			},	
			getGene : function()	{
				return gene_list;
			},
			getWidth : function()	{
				return layout_width;
			},
			getHeight : function()	{
				return layout_height;
			},	
		}
	}());
	return 	{
		VO : VO
	}
});