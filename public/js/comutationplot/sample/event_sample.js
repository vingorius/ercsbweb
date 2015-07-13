define("sample/event_sample", ["utils", "size"], function(_utils, _size)	{
	var get_mouseover = function(_d)	{
		var target = d3.select(this);
		var e = d3.event;

		_utils.tooltip(e, "Sample : <span style='color : red;'>" + _d.sample 
			+ "</span></br>" + _d.type + " : <span style='color : red;'>" + _d.count
			+ "</span>"
			, e.pageX, e.pageY);
	}

	var get_mouseout = function(_d)	{
		var e = d3.event;

		_utils.tooltip();
	}

	var move_scroll = function()	{
		var target_1 = $("#comutationplot_sample");
		var target_2 = $("#comutationplot_heatmap");

		target_1.scroll(function()	{
			target_2.scrollLeft(target_1.scrollLeft());
		});
	}

	return {
		m_over : get_mouseover,
		m_out : get_mouseout,
		move_scroll : move_scroll
	}
});