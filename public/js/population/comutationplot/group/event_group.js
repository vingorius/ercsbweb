var GROUP = "population/comutationplot/group/";
var SORT = "population/comutationplot/sort_comutationplot";
var VO = "population/comutationplot/vo_comutationplot";

define(GROUP + "event_group", ["utils", "size", VO, SORT], function(_utils, _size, _VO, _sort)	{
	var tooltip = Object.create(_utils.tooltip);
	tooltip.div = $(".tooltip_chart");

	var getSampleName = function(_group)	{
		var result = [];

		for(var i = 0, len = _group.length ; i < len ; i++)	{
			result.push(_group[i].sample);
		}
		return result;
	}

	var clickSort = function(_this, _sort_order, _d)	{
		var ex = _sort.loopingGroup(_sort_order);
		var samples = getSampleName(ex);

		_VO.VO.setSample(samples);
		_VO.VO.setSortOrder(_sort_order);

		var x = _utils.ordinalScale(_VO.VO.getSample(), 0, _VO.VO.getWidth() - 2);
		var y = _utils.ordinalScale(_VO.VO.getGene(), 0, _VO.VO.getHeight())
		var sample = d3.selectAll(".comutationplot_sample_bargroup");
		var comutation = d3.selectAll(".comutationplot_cellgroup");

		changeGroup(x);	
		changeSample(x, sample);
		changeComutation(x, y, comutation);
	}

	var changeGroup = function(_x)	{
		_utils.attributeXY(d3.selectAll(".comutationplot_bar_group_rects"), "x", _x, "sample", false);
	}

	var changeSample = function(_x, _sample)	{
		_utils.translateXY(_sample, _x, 0, "name", false, false);
	}

	var changeComutation = function(_x, _y, _comutation)	{
		_utils.translateXY(_comutation, _x, _y, "sample", "gene", false, false);
	}

	var nameMouseover = function(_this, _name, _data)	{			
		tooltip.show(_this, "<b>Clinical " + _name + "</b></br>sample : "  + _data.sample + "</br>value : " + (!_data.value ? "NA" : _data.value), "rgba(15, 15, 15, 0.6)");
		_size.styleStroke(d3.select(_this), "#333", 1, 50);
	}

	var explainMouseover = function(_d)	{
		tooltip.show(this, "<b>" + _d.name + "</b></br>click to sort </br>alt + click add to key", "rgba(178, 0, 0, 0.6)");
	}

	var commonMouseout = function(_this, _type)		{
		if(_type === "rect")	{
			_size.styleStroke(d3.select(_this), "#fff", 0, 250);
		}
		tooltip.hide();
	}

	return 	{
		clickSort : clickSort,
		nover : nameMouseover,
		eover : explainMouseover,
		mout : commonMouseout
	}
});