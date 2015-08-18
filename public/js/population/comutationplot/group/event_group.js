var GROUP = "population/comutationplot/group/";
var SORT = "population/comutationplot/sort_comutationplot";
var VO = "population/comutationplot/vo_comutationplot";

define(GROUP + "event_group", ["utils", "size", VO, SORT], function(_utils, _size, _VO, _sort)	{
	var getSampleName = function(_group)	{
		var result = [];

		for(var i = 0, len = _group.length ; i < len ; i++)	{
			result.push(_group[i].sample);
		}
		return result;
	}

	var name_click = function(_this, _name, _group)	{
		var samples = getSampleName(_group);
		var vo = _VO.VO;
		vo.setSample(samples);

		var x = _utils.ordinalScale(vo.getSample(), vo.getMarginLeft(), (vo.getWidth() - vo.getMarginLeft()));
		var group = d3.select(_this);
		var sample = d3.selectAll(".comutationplot_sample_bargroup");
		var comutation = d3.selectAll(".comutationplot_cellgroup");

		changeGroup(x);	
		changeSample(x, sample);
		changeComutation(x, comutation);
	}

	var changeGroup = function(_x)	{
		var group_rects = d3.selectAll(".comutationplot_bar_group_rects");

		group_rects
		.transition().duration(400)
		.attr("x", function(_d)	{
			_d.x = _x;
			return _x(_d.sample);
		});
	}

	var changeSample = function(_x, _sample)	{
		_sample
		.transition().duration(400)
		.attr("transform", function(_d)	{
			_d.x = _x;
			return "translate(" + _x(_d.sample) + ", 0)";
		});
	}

	var changeComutation = function(_x, _comutation)	{
		_comutation
		.transition().duration(400)
		.attr("transform", function(_d)	{
			_d.x = _x;
			return "translate(" + _x(_d.sample) + ", " + _d.y(_d.gene) + ")";
		});
	}

	var name_over = function(_d)	{
		var e = d3.event;

		_utils.tooltip(
			e, 
			"sample : <span style='color : red;'>"  
			+ _d.sample 
			+ "</span></br>value : <span style='color : red;'>" 
			+ _d.value
			+ "</span>",
			e.pageX, e.pageY
		);
	}

	var name_out = function(_d)	{
		_utils.tooltip();
	}

	return 	{
		nclick : name_click,
		nover : name_over,
		nout : name_out
	}
});