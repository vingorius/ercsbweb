var GENE = "population/comutationplot/gene/";
var VO = "population/comutationplot/vo_comutationplot";

define(GENE + "event_gene", ["utils", "size", VO], function(_utils, _size, _VO)	{
	var axisMouseover = function(_d)	{
		d3.select(this)
		.transition().duration(100)
		.style("font-size", "12px");
	}

	var barMouseover = function(_d)	{
		_utils.tooltip(this, "<b>" + _d.name + "</b></br>" + _d.type  + " : "  + _d.count, "rgba(15, 15, 15, 0.6)");

		d3.select(this)
		.transition().duration(50)
		.style("stroke", "#333")
		.style("stroke-width", 1);
	}

	var explainMouseover = function(_d)	{
		_utils.tooltip(this, "sort by samples", "rgba(178, 0, 0, 0.6)");
	}

	var commonMouseout = function(_this, _type)	{
		if(_type === "axis")	{
			d3.select(_this)
			.transition().duration(100)
			.style("font-size", "8px");
		}
		else if(_type === "bar")	{
			d3.select(_this)
			.transition().duration(250)
			.style("stroke", "#fff")
			.style("stroke-width", 0);
		}
		_utils.tooltip();
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
		var magnification = 2;
		var y = _utils.ordinalScale(_VO.VO.getGene(), 0, (_size.height - _size.margin.bottom));
		var x = _utils.ordinalScale(_VO.VO.getSample(), 0, (_VO.VO.getWidth() * magnification));

		_utils.callAxis(d3.selectAll(".comutationplot_gene_yaxis"), y, "right");
		_utils.translateXY(d3.selectAll(".comutationplot_pq_bargroup"), 0, y, 0, "gene", false, false);
		_utils.translateXY(d3.selectAll(".comutationplot_cellgroup"), x, y, "sample", "gene", false, false);
		_utils.translateXY(d3.selectAll(".comutationplot_patient_cellgroup"), 0, y, "sample", "gene", true, false);
		_utils.translateXY(d3.selectAll(".comutationplot_gene_bargroup"), 0, y, 0, "name", false, false);
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