define("pq/event_pq", ["utils", "size"], function(_utils, _size)	{
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

		_utils.tooltip(e);
		
		target.transition().duration(100)
		.style("fill", "#BFBFBF");
	}

	return {
		m_over : get_mouseover,
		m_out : get_mouseout
	}
});