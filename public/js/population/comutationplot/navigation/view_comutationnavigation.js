define("population/comutationplot/navigation/view_comutationnavigation", ["utils", "size", "population/comutationplot/navigation/event_comutationnavigation"], function(_utils, _size, _event)	{
	var makeHandler = function(_id, _click, _over, _out)	{
		return d3.select("#" + _id)
		.on("click", _click)
		.on("mouseover", _over)
		.on("mouseout", _out);
	}

	var view = function(_data)	{
		var e = _event(_data) || null;
		
		var draw_up = makeHandler("comutationplot_draw_up", e.click, e.over, e.out);
		var draw_down = makeHandler("comutationplot_draw_down", e.click, e.over, e.out);
		var initial_button = makeHandler("comutationplot_initial_button", e.init, e.over, e.out);
	}
	
	return {
		view : view
	}
});