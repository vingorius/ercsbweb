var SAMPLE = "population/comutationplot/sample/";
var VO = "population/comutationplot/vo_comutationplot";

define(SAMPLE + "event_sample", ["utils", "size", VO], function(_utils, _size, _VO)	{
	var get_mouseover = function(_d)	{
		var target = d3.select(this);
		var e = d3.event;

		_utils.tooltip(
			e, 
			"type: <span style='color : red;'>" 
			+ _d.type 
			+ "</span></br>count : <span style='color : red;'>" 
			+ _d.count
			+ "</span>"
			, e.pageX, e.pageY
		);
	}

	var get_mouseout = function(_d)	{
		var e = d3.event;

		_utils.tooltip();
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
			result.push(_sorting_data[i].sample);
		}
		return result;
	}

	var redraw_xaxis = function(_sorting_data, _size)	{
		var x = _utils.ordinalScale(_VO.VO.getSample(), _VO.VO.getMarginLeft(), (_VO.VO.getWidth() - _VO.VO.getMarginLeft()));
		var y = _utils.ordinalScale(_VO.VO.getGene(), _VO.VO.getMarginTop(), (_VO.VO.getHeight() - _VO.VO.getMarginTop()));

		d3.selectAll(".comutationplot_sample_bargroup")
		.transition().duration(400)
		.attr("transform", function(_d)	{
			return "translate(" + x(_d.sample) + ", 0)";
		});

		d3.selectAll(".comutationplot_sample_bars")
		.attr("width", function(_d) { 
			return x.rangeBand(); 
		});

		d3.selectAll(".comutationplot_bar_group_rects")
		.transition().duration(250)
		.attr("x", function(_d)	{
			return x(_d.sample);
		});

		d3.selectAll(".comutationplot_cellgroup")
		.transition().duration(400)
		.attr("transform", function(_d)	{
			if(!y(_d.gene))	{
				return "translate(" + x(_d.sample) + ", " + y(_d.gene) +")";	
			}
			return "translate(" + x(_d.sample) + ", " + y(_d.gene) +")";
		});

		d3.selectAll(".comutationplot_cells")
		.transition().duration(400)
		.attr("x", 0)
		.attr("width", function(_d) { 
			return x.rangeBand(); 
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
		_VO.VO.setSample(sorting_get_name(sort_data));
		redraw_xaxis(sorting_get_name(sort_data), _d.size);
	}

	return {
		m_over : get_mouseover,
		m_out : get_mouseout,
		sort_by_value : sort_by_value
	}
});