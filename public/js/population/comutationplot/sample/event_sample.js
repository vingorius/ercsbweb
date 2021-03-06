// 'use strict';
var SAMPLE = "population/comutationplot/sample/";
var VO = "population/comutationplot/vo_comutationplot";
var SORT = "population/comutationplot/sort_comutationplot";

define(SAMPLE + "event_sample", ["utils", "size", VO, SORT], function(_utils, _size, _VO, _sort)	{
	var barMouseover = function(_d)	{
		_utils.tooltip.show(this, "<b>" + _d.name + "</b></br>" + _utils.mutate(_d.type).name + " : " + _d.count, "rgba(15, 15, 15, 0.6)");
		_size.styleStroke(d3.select(this), "#333", 1, 50);
	}

	var explainMouseover = function(_d)	{
		_utils.tooltip.show(this, "sort by mutations", "rgba(178, 0, 0, 0.6)");
	}

	var commonMouseout = function(_this, _type)	{
		if(_type === "bar")	{
			_size.styleStroke(d3.select(_this), "#fff", 0, 250);
		}
		_utils.tooltip.hide();		
	}

	var ascending = function(_a, _b)	{
		return (_utils.getSumList(_a.types, "count") > _utils.getSumList(_b.types, "count")) ? 1 : -1;
	}

	var descending = function(_a, _b)	{
		return (_utils.getSumList(_a.types, "count") < _utils.getSumList(_b.types, "count")) ? 1 : -1;
	}

	var redraw = function(_sorting_data, _size)	{
		var x = _utils.ordinalScale(_VO.VO.getSample(), 0, _VO.VO.getWidth());
		var y = _utils.ordinalScale(_VO.VO.getGene(), 0, _VO.VO.getHeight());

		_utils.attributeSize(d3.selectAll(".comutationplot_cells"), "width", x);
		_utils.attributeSize(d3.selectAll(".comutationplot_sample_bars"), "width", x);
		_utils.attributeXY(d3.selectAll(".comutationplot_bar_group_rects"), "x", x, "sample", false, false);
		_utils.translateXY(d3.selectAll(".comutationplot_cellgroup"), x, y, "sample", "gene", false, false);
		_utils.translateXY(d3.selectAll(".comutationplot_sample_bargroup"), x, 0, "name", 0, false, false);
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
		_VO.VO.setSample(_utils.getOnlyDataObjArray(sort_data, "name"));
		redraw(_utils.getOnlyDataObjArray(sort_data, "name"), _d.size);
	}
	
	return {
		m_over : barMouseover,
		e_over : explainMouseover,
		m_out : commonMouseout,
		sortByValue : sortByValue
	}
});