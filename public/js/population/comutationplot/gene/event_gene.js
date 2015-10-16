define("population/comutationplot/gene/event_gene", ["utils", "size", "population/comutationplot/vo_comutationplot"], function(_utils, _size, _VO)	{
	var tooltip = Object.create(_utils.tooltip);
	var axisMouseover = function(_d)	{
		d3.select(this)
		.transition().duration(50)
		.style("font-size", "12px");
	}

	var barMouseover = function(_d)	{
		tooltip.show(this, "<b>" + _d.name + "</b></br>" + _d.type  + " : "  + _d.count, "rgba(15, 15, 15, 0.6)");
		_size.styleStroke(d3.select(this), "#333", 1, 50);
	}

	var explainMouseover = function(_d)	{
		tooltip.show(this, "sort by samples", "rgba(178, 0, 0, 0.6)");
	}

	var commonMouseout = function(_this, _type)	{
		if(_type === "axis")	{
			d3.select(_this)
			.transition().duration(250)
			.style("font-size", "8px");
		}
		else if(_type === "bar")	{
			_size.styleStroke(d3.select(_this), "#fff", 0, 250);
		}
		tooltip.hide();
	}

	var ascending = function(_a, _b)	{
		return (_utils.getSumList(_a.types, "count") > _utils.getSumList(_b.types, "count")) ? 1 : -1;
	}

	var descending = function(_a, _b)	{
		return (_utils.getSumList(_a.types, "count") < _utils.getSumList(_b.types, "count")) ? 1 : -1;
	}

	var sortingByName = function(_sorting_data)	{
		var result = [];

		for(var i = 0, len = _sorting_data.length ; i < len ; i++)	{
			result.push(_sorting_data[i].name);
		}
		return result;
	}

	var redraw = function(_sorting_data, _size)	{
		var y = _utils.ordinalScale(_VO.VO.getGene(), 0, (_size.height - _size.margin.bottom));
		var x = _utils.ordinalScale(_VO.VO.getSample(), 0, _VO.VO.getWidth());

		_utils.translateXY(d3.selectAll(".comutationplot_gene_bargroup"), 0, y, 0, "name", false, false);
		_utils.translateXY(d3.selectAll(".comutationplot_pq_bargroup"), 0, y, 0, "gene", false, false);
		_utils.translateXY(d3.selectAll(".comutationplot_cellgroup"), x, y, "sample", "gene", false, false);
		_utils.translateXY(d3.selectAll(".comutationplot_patient_cellgroup"), 0, y, "sample", "gene", true, false);
		_utils.callAxis(d3.selectAll(".comutationplot_gene_yaxis"), y, "right");
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
		_VO.VO.setGene(sortingByName(sort_data));
		redraw(sortingByName(sort_data), _d.size);
	}
	return {
		axisOver : axisMouseover,
		barOver : barMouseover,
		explainOver : explainMouseover,
		mouseout : commonMouseout,
		sortByValue : sortByValue
	}
});