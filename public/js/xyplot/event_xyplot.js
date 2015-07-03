define("xyplot/event_xyplot", ["utils", "size"], function(_utils, _size)	{
	var get_mouseover = function(_d)	{
		var target = d3.select(this);
		var e = d3.event;
		var radius = 3;

		target.transition().duration(100)
		.attr("r", radius * 2.5);

		_utils.tooltip(e
			, "<strong>Title : <span style='color:red'>"
			+ _d.title
			+ "</span></br> X : <span style='color:red'>"
			+ _d.x
			+ "</span></br> Y : <span style='color:red'>"
			+ _d.y
			+ "</span>"
			, e.pageX, e.pageY - 40);
	}

	var get_mouseout = function(_d)	{
		var target = d3.select(this);
		var e = d3.event;
		var radius = 3;

		target.transition().duration(100)
		.attr("r", radius);

		_utils.tooltip(e);
	}

	return {
		m_over : get_mouseover,
		m_out : get_mouseout
	}
});