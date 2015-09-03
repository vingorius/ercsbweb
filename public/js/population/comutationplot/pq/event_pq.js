var PQ = "population/comutationplot/pq/";
var VO = "population/comutationplot/vo_comutationplot";


define(PQ + "event_pq", ["utils", "size", VO], function(_utils, _size, _VO)	{
	var barMouseover = function(_d)	{
		_utils.tooltip(
			this, 
			"<b>q value</b></br>gene : <span style='color : white;'>" 
			+ _d.gene 
			+ "</span></br>q : <span style='color : white;'>" 
			+ Number(_utils.log(_d.q)).toFixed(4) 
			+ "</span>", "rgba(15, 15, 15, 0.6)");

		d3.select(this)
		.transition().duration(100)
		.style("fill", d3.rgb("#BFBFBF").darker(2))
		.style("stroke", "black")
		.style("stroke-width", 1);
	}

	var commonMouseout = function(_this, _type)	{
		if(_type === "bar")	{
			d3.select(_this)
			.transition().duration(100)
			.style("fill", "#BFBFBF")
			.style("stroke", null);
		}
		_utils.tooltip();
		
	}

	var explainMouseover = function(_d)	{
		_utils.tooltip(this, "Sort by q value", "rgba(178, 0, 0, 0.6)");
	}

	var ascending = function(_a, _b)	{
		return (_utils.getSumOfList(_a.list, "q") > _utils.getSumOfList(_b.list, "q")) ? 1 : -1;
	}

	var descending = function(_a, _b)	{
		return (_utils.getSumOfList(_a.list, "q") < _utils.getSumOfList(_b.list, "q")) ? 1 : -1;
	}

	var sortingByName = function(_sorting_data)	{
		try{
			var result = [];

			for(var i = 0, len = _sorting_data.length ; i < len ; i++)	{
				result.push(_sorting_data[i].gene);
			}
			return result;
		}
		finally {
			result = null;
		}
	}

	var redraw = function(_sorting_data, _size)	{
		var magnification = 2;
		var left_between = 1.5;
		var top_between = 1.2;
		var y = _utils.ordinalScale(_VO.VO.getGene(), 0, (_size.height - _size.margin.bottom));
		var x = _utils.ordinalScale(_VO.VO.getSample(), 0, _VO.VO.getWidth() * magnification);

		_utils.callAxis(d3.selectAll(".comutationplot_gene_yaxis"), y, "right");
		_utils.translateXY(d3.selectAll(".comutationplot_gene_bargroup"), 0, y, 0, "gene", false, false);
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