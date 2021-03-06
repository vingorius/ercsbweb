// 'use strict';
define("population/comutationplot/gene/event_gene", ["utils", "size", "population/comutationplot/vo_comutationplot"], function(_utils, _size, _VO)	{
	var axisMouseover = function(_d)	{
		d3.select(this)
		.transition().duration(50)
		.style("font-size", "12px");
	}

	var barMouseover = function(_d)	{
		_utils.tooltip.show(this, "<b>" + _d.name + "</b></br>" + _d.type  + " : "  + _d.count, "rgba(15, 15, 15, 0.6)");
		_size.styleStroke(d3.select(this), "#333", 1, 50);
	}

	var explainMouseover = function(_d)	{
		_utils.tooltip.show(this, "sort by samples", "rgba(178, 0, 0, 0.6)");
	}

	var mouseOut = function(_this, _type)	{
		if(_type === "axis")	{
			d3.select(_this)
			.transition().duration(250)
			.style("font-size", "8px");
		}
		else if(_type === "bar")	{
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
		var y = _utils.ordinalScale(_VO.VO.getGene(), 0, (_size.height - _size.margin.bottom));

		_utils.callAxis(d3.selectAll(".comutationplot_gene_yaxis"), y, "right");
		_utils.translateXY(d3.selectAll(".comutationplot_gene_bargroup"), 0, y, 0, "name", false, false);
		_utils.translateXY(d3.selectAll(".comutationplot_pq_bargroup"), 0, y, 0, "gene", false, false);
		_utils.translateXY(d3.selectAll(".comutationplot_cellgroup"), x, y, "sample", "gene", false, false);
		_utils.translateXY(d3.selectAll(".comutationplot_patient_cellgroup"), 0, y, "sample", "gene", true, false);
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
		_VO.VO.setGene(_utils.getNotExistDataInObjArray(sort_data, "name"));
		redraw(_utils.getNotExistDataInObjArray(sort_data, "name"), _d.size);
	}
	
	return {
		axisOver : axisMouseover,
		barOver : barMouseover,
		explainOver : explainMouseover,
		mouseout : mouseOut,
		sortByValue : sortByValue
	}
});