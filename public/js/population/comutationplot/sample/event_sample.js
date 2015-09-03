var SAMPLE = "population/comutationplot/sample/";
var VO = "population/comutationplot/vo_comutationplot";
var SORT = "population/comutationplot/sort_comutationplot";

define(SAMPLE + "event_sample", ["utils", "size", VO, SORT], function(_utils, _size, _VO, _sort)	{
	var barMouseover = function(_d)	{
		_utils.tooltip(
			this, "<b>" + _d.sample + "</b></br>type: " + _utils.definitionMutationName(_d.type) 
			+ "</br>count : " + _d.count, "rgba(15, 15, 15, 0.6)");

		d3.select(this)
		.transition().duration(250)
		.style("stroke", "black")
		.style("stroke-width", 1);
	}

	var commonMouseout = function(_this, _type)	{
		if(_type === "bar")	{
			d3.select(_this)
			.transition().duration(250)
			.style("stroke", function(_d) { 
				return null; 
			});
		}
		_utils.tooltip();		
	}

	var explainMouseover = function(_d)	{
		_utils.tooltip(this, "Sort by mutations", "rgba(178, 0, 0, 0.6)");
	}

	var ascending = function(_a, _b)	{
		return (_utils.getSumOfList(_a.types, "count") > _utils.getSumOfList(_b.types, "count")) ? 1 : -1;
	}

	var descending = function(_a, _b)	{
		return (_utils.getSumOfList(_a.types, "count") < _utils.getSumOfList(_b.types, "count")) ? 1 : -1;
	}

	var sortingByName = function(_sorting_data)	{
		var result = [];

		for(var i = 0, len = _sorting_data.length ; i < len ; i++)	{
			result.push(_sorting_data[i].sample);
		}
		return result;
	}

	var redraw = function(_sorting_data, _size)	{
		var magnification = 2;
		var left_between = 1.5;
		var top_between = 1.2;
		var sample = _VO.VO.getSample();
		var x = _utils.ordinalScale(sample, 0, _VO.VO.getWidth() * magnification);
		var y = _utils.ordinalScale(_VO.VO.getGene(), _VO.VO.getMarginTop(), (_VO.VO.getHeight() - _VO.VO.getMarginTop()));

		_utils.attributeSize(d3.selectAll(".comutationplot_cells"), "width", x, left_between);
		_utils.attributeSize(d3.selectAll(".comutationplot_sample_bars"), "width", x, left_between);
		_utils.attributeXY(d3.selectAll(".comutationplot_bar_group_rects"), "x", x, "sample", false, false);
		_utils.translateXY(d3.selectAll(".comutationplot_cellgroup"), x, y, "sample", "gene", false, false);
		_utils.translateXY(d3.selectAll(".comutationplot_sample_bargroup"), x, 0, "sample", 0, false, false);
	}

	var sortByValue = function(_d)	{
		var sort_data;

		if(_d.status)	{
			sort_data =_d.data.sort(ascending);
			_d.status = false;
		}
		else{
			sort_data =_d.data.sort(descending);
			_d.status = true;
		}
		_VO.VO.setSample(sortingByName(sort_data));
		redraw(sortingByName(sort_data), _d.size);
	}

	return {
		m_over : barMouseover,
		e_over : explainMouseover,
		m_out : commonMouseout,
		sortByValue : sortByValue
	}
});