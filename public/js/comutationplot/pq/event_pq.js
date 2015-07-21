var PQ = "comutationplot/pq/";
var VO = "comutationplot/vo_comutationplot";


define(PQ + "event_pq", ["utils", "size", VO], function(_utils, _size, _VO)	{
	var get_mouseover = function(_d)	{
		var target = d3.select(this);
		var e = d3.event;
		
		_utils.tooltip(e, "Gene : <span style='color : red;'>" + _d.name 
			+ "</span></br>q : <span style='color : red;'>" + Number(_utils.log(_d.q)).toFixed(4)
			+ "</span>"
			, e.pageX - 50, e.pageY);

		target.transition().duration(100)
		.style("fill", d3.rgb("#BFBFBF").darker(1));
	}

	var get_mouseout = function(_d)	{
		var target = d3.select(this);
		var e = d3.event;

		_utils.tooltip();
		
		target.transition().duration(100)
		.style("fill", "#BFBFBF");
	}

	var ascending = function(_a, _b)	{
		return (_utils.get_list_sum(_a.list, "q") > _utils.get_list_sum(_b.list, "q")) 
		? 1 : -1;
	}

	var descending = function(_a, _b)	{
		return (_utils.get_list_sum(_a.list, "q") < _utils.get_list_sum(_b.list, "q")) 
		? 1 : -1;
	}

	var sorting_get_name = function(_sorting_data)	{
		try{
			var result = [];

			for(var i = 0, len = _sorting_data.length ; i < len ; i++)	{
				result.push(_sorting_data[i].name);
			}
			return result;
		}
		finally {
			result = null;
		}
	}

	var redraw_yaxis = function(_sorting_data, _size)	{
		var vo = _VO.VO;
		var y = _utils.ordinalScale(vo.getGene(), _size.margin.top, (_size.height - _size.margin.top));
		var x = _utils.ordinalScale(vo.getSample(),vo.getMarginLeft(), (vo.getWidth() - vo.getMarginLeft()));

		d3.selectAll(".comutationplot_pq_bars")
		.transition().duration(400)
		.attr("y", function(_d) { return y(_d.name); });

		d3.selectAll(".comutationplot_cellgroup")
		.transition().duration(400)
		.attr("transform", function(_d)	{
			if(!x(_d.sample))	{
				return "translate(" + _d.x(_d.sample) + ", " + y(_d.gene) +")";	
			}
			return "translate(" + x(_d.sample) + ", " + y(_d.gene) +")";	
		});

		d3.selectAll(".comutationplot_gene_yaxis")
		.transition().duration(400)
		.call(d3.svg.axis().scale(y).orient("right"));

		d3.selectAll(".comutationplot_gene_bars")
		.transition().duration(400)
		.attr("y", function(_d) { return y(_d.gene); });
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
		m_over : get_mouseover,
		m_out : get_mouseout,
		sort_by_value : sort_by_value
	}
});