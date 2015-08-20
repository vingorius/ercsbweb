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

	var name_click = function(_this, _group)	{
		var vo = _VO.VO;
		var separate = _sort.group(_group, _group, vo.getFormatedData().sample);
		var ex = loopingGroup(separate);
		var samples = _sort.spliceAndUnshiftExclusive(getSampleName(ex));
		magnification = 3;
		vo.setSample(samples);
		vo.setSortOrder([]);

		var x = _utils.ordinalScale(vo.getSample(), 0, vo.getWidth() * magnification);
		var y = _utils.ordinalScale(vo.getGene(), 0, vo.getHeight() - vo.getMarginBottom())
		var group = d3.select(_this);
		var sample = d3.selectAll(".comutationplot_sample_bargroup");
		var comutation = d3.selectAll(".comutationplot_cellgroup");

		changeGroup(x);	
		changeSample(x, sample);
		changeComutation(x, y, comutation);
	}

	var multi_click = function(_this, _group)	{
		var vo = _VO.VO;
		var sort_order = (vo.getSortOrder().length < 1) ? 
		_sort.group(_group, _group, vo.getFormatedData().sample) : 
		loopingMultiSort(vo.getSortOrder(), _group);
		var ex = loopingGroup(sort_order);
		var samples = _sort.spliceAndUnshiftExclusive(getSampleName(ex));
		magnification = 3;
		vo.setSortOrder(sort_order);
		vo.setSample(samples);

		var x = _utils.ordinalScale(vo.getSample(), 0, vo.getWidth() * magnification);
		var y = _utils.ordinalScale(vo.getGene(), 0, vo.getHeight() - vo.getMarginBottom())
		var group = d3.select(_this);
		var sample = d3.selectAll(".comutationplot_sample_bargroup");
		var comutation = d3.selectAll(".comutationplot_cellgroup");

		changeGroup(x);	
		changeSample(x, sample);
		changeComutation(x, y, comutation);	
	}

	var loopingMultiSort = function(_sort_order, _group)	{
		var vo = _VO.VO;
		var result = [];

		for(var i = 0, len = _sort_order.length ; i < len ; i++)	{
			var sort_order = _sort_order[i];
			var separate = _sort.group(sort_order, _group, vo.getFormatedData().sample);
			
			$.merge(result, separate);
		}
		return result;
	}

	var loopingGroup = function(_separate)	{
		var result = [];

		for(var i = 0, len = _separate.length ; i < len ; i++)	{
			var separate = _separate[i];
			var ex = _sort.exclusiveGroup(separate, separate.length);

			$.merge(result, ex);
		}
		return result;
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

	var changeComutation = function(_x, _y, _comutation)	{
		_comutation
		.transition().duration(400)
		.attr("transform", function(_d)	{
			_d.x = _x;
			_d.y = _y;
			return "translate(" + _x(_d.sample) + ", " + _y(_d.gene) + ")";
		});
	}

	var name_over = function(_d)	{
		var target = d3.select(this);
		var e = d3.event;

		_utils.tooltip(
			e, 
			"sample : <span style='color : red;'>"  
			+ _d.sample 
			+ (!_d.value ? "" : "</span></br>value : <span style='color : red;'>" + _d.value)
			+ "</span>",
			e.pageX, e.pageY
		);

		target
		.transition().duration(250)
		.style("stroke", "#000")
		.style("stroke-width", 1);
	}

	var name_out = function(_d)	{
		var target = d3.select(this);

		_utils.tooltip();

		target
		.transition().duration(250)
		.style("stroke", function(_d)	{
			return null;
		});
	}

	return 	{
		nclick : name_click,
		mclick : multi_click,
		nover : name_over,
		nout : name_out
	}
});