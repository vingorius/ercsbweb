define("population/comutationplot/pq/event_pq", ["utils", "size", "population/comutationplot/vo_comutationplot"], function(_utils, _size, _VO)	{
	var barMouseover = function(_d)	{
		var text = (_d.q ? "q" : "p").toUpperCase();

		_utils.tooltip.show(this, "<b>" + _d.gene + "</b></br>" + text + " : " + Number(_utils.calLog((_d.q || _d.p))).toFixed(4) , "rgba(15, 15, 15, 0.6)");

		d3.select(this)
		.transition().duration(50)
		.style("fill", d3.rgb("#BFBFBF").darker(2))
		.style("stroke", "#333")
		.style("stroke-width", 1);
	}

	var explainMouseover = function(_d)	{
		var type = (_d.data[0].list[0].q ? "q" : "p").toUpperCase();

		_utils.tooltip.show(this, "sort by " + type + " value", "rgba(178, 0, 0, 0.6)");
	}

	var commonMouseout = function(_this, _type)	{
		if(_type === "bar")	{
			d3.select(_this)
			.transition().duration(250)
			.style("fill", "#BFBFBF")
			.style("stroke-width", 0);
		}
		_utils.tooltip.hide();
		
	}

	var ascending = function(_a, _b)	{
		var type = _a.list[0].q ? "q" : "p";

		return (_utils.getSumList(_a.list, type) > _utils.getSumList(_b.list, type)) ? 1 : -1;
	}

	var descending = function(_a, _b)	{
		var type = _a.list[0].q ? "q" : "p";

		return (_utils.getSumList(_a.list, type) < _utils.getSumList(_b.list, type)) ? 1 : -1;
	}

	var sortingByName = function(_sorting_data)	{
		var result = [];

		for(var i = 0, len = _sorting_data.length ; i < len ; i++)	{
			result.push(_sorting_data[i].gene);
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
		m_over : barMouseover,
		m_out : commonMouseout,
		e_over : explainMouseover,
		sortByValue : sortByValue
	}
});