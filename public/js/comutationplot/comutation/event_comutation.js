define("comutation/event_comutation", ["utils", "size"], function(_utils, _size)	{
	var event_mouseover = function(_d)	{
		var target = d3.select(this);
		var e = d3.event;

		this.parentNode.parentNode.appendChild(this.parentNode);

		_utils.tooltip(e, "x : <span style='color : red;'>"  + _d.sample 
                + "</span></br>y : <span style='color : red;'>" + _d.gene
                + "</span></br>type : <span style='color : red;'>" + _d.type 
                + "</span>"
                , e.pageX, e.pageY + 10);

		target.transition().duration(10)
		.style("stroke", "black")
		.style("stroke-width", 2);
	}

	var event_mouseout = function(_d)	{
		var target = d3.select(this);
		var e = d3.event;

		_utils.tooltip();

		target.transition().duration(10)
		.style("stroke", function(_d) { return _utils.colour(_d.type[0]); })
		.style("stroke-width", function(_d) { return 1; });
	}

	return {
		m_over : event_mouseover,
		m_out : event_mouseout
	}
})