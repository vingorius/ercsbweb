define("gene/event_gene", ["utils", "size"], function(_utils, _size)	{
	var get_axis_mouseover = function(_d)	{
		var target = d3.select(this);

		target.transition().duration(100)
		.style("font-size", 14);
	}

	var get_axis_mouseout = function(_d)	{
		var target = d3.select(this);

		target.transition().duration(100)
		.style("font-size", 12);
	}

	var get_bar_mouseover = function(_d)	{
		var target = d3.select(this);
		var e = d3.event;

		_utils.tooltip(e, "Gene : <span style='color : red;'>" + _d.gene 
			+ "</span></br>Count : <span style='color : red;'>" + _d.count
			+ "</span>"
			, e.pageX, e.pageY);

		target.transition().duration(100)
		.style("stroke", "black");
	}

	var get_bar_mouseout = function(_d)	{
		var target = d3.select(this);
		var e = d3.event;
		
		_utils.tooltip(e);
		target.transition().duration(100).style("stroke", "#BFBFBF");
	}

	return {
		axis_m_over : get_axis_mouseover,
		axis_m_out : get_axis_mouseout,
		bar_m_over : get_bar_mouseover,
		bar_m_out : get_bar_mouseout
	}
});