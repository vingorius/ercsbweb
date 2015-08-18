var GENE = "population/comutationplot/gene/";
var VO = "population/comutationplot/vo_comutationplot";

define(GENE + "event_gene", ["utils", "size", VO], function(_utils, _size, _VO)	{
	var get_axis_mouseover = function(_d)	{
		var target = d3.select(this);

		target.transition().duration(100)
		.style("font-size", 12);
	}

	var get_axis_mouseout = function(_d)	{
		var target = d3.select(this);

		target.transition().duration(100)
		.style("font-size", 8);
	}

	var get_bar_mouseover = function(_d)	{
		var target = d3.select(this);
		var e = d3.event;

		_utils.tooltip(
			e, 
			"type : <span style='color : red;'>" 
			+ _d.type 
			+ "</span></br>count : <span style='color : red;'>" 
			+ _d.count
			+ "</span>", 
			e.pageX, e.pageY
		);

		target.transition().duration(100)
		.style("stroke", "black");
	}

	var get_bar_mouseout = function(_d)	{
		var target = d3.select(this);
		var e = d3.event;
		
		_utils.tooltip();
		target.transition().duration(100)
		.style("stroke", "#BFBFBF");
	}

	var ascending = function(_a, _b)	{
		return (_utils.get_list_sum(_a.types, "count") > _utils.get_list_sum(_b.types, "count")) ? 1 : -1;
	}

	var descending = function(_a, _b)	{
		return (_utils.get_list_sum(_a.types, "count") < _utils.get_list_sum(_b.types, "count")) ? 1 : -1;
	}

	var sorting_get_name = function(_sorting_data)	{
		var result = [];

		for(var i = 0, len = _sorting_data.length ; i < len ; i++)	{
			result.push(_sorting_data[i].gene);
		}
		return result;
	}

	var redraw_yaxis = function(_sorting_data, _size)	{
		var vo = _VO.VO;
		var y = _utils.ordinalScale(vo.getGene(), 0, (_size.height - _size.margin.bottom));
		var x = _utils.ordinalScale(vo.getSample(),vo.getMarginLeft(), (vo.getWidth() - vo.getMarginLeft()));

		d3.selectAll(".comutationplot_gene_yaxis")
		.transition().duration(400)
		.call(d3.svg.axis().scale(y).orient("right"));

		d3.selectAll(".comutationplot_gene_bargroup")
		.transition().duration(400)
		.attr("transform", function(_d)	{
			return "translate(0, " + y(_d.gene) + ")";
		});

		d3.selectAll(".comutationplot_cellgroup")
		.transition().duration(400)
		.attr("transform", function(_d)	{
			if(!x(_d.sample))	{
				return "translate(" + _d.x(_d.sample) + ", " + y(_d.gene) +")";	
			}
			return "translate(" + x(_d.sample) + ", " + y(_d.gene) +")";	
		});

		d3.selectAll(".comutationplot_pq_bargroup")
		.transition().duration(400)
		.attr("transform", function(_d)	{
			return "translate(0, " + y(_d.gene) + ")"
		});
	}

	var sort_by_value = function(_d)	{
		var sort_data;

		if(_d.status)	{
			sort_data =_d.data.sort(ascending);
			_d.status = false;
		}
		else{
			sort_data =_d.data.sort(descending);
			_d.status = true;
		}
		_VO.VO.setGene(sorting_get_name(sort_data));
		redraw_yaxis(sorting_get_name(sort_data), _d.size);
	}
	return {
		axis_m_over : get_axis_mouseover,
		axis_m_out : get_axis_mouseout,
		bar_m_over : get_bar_mouseover,
		bar_m_out : get_bar_mouseout,
		sort_by_value : sort_by_value
	}
});