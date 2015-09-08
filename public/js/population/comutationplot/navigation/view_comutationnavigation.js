var COMUTS_NAVI = "population/comutationplot/navigation/";

define(COMUTS_NAVI + "view_comutationnavigation", ["utils", "size", COMUTS_NAVI + "event_comutationnavigation"], function(_utils, _size, _event)	{
	var view = function(_data)	{
		var e = _event(_data) || null;
		
		var draw_up = d3.select("#comutationplot_draw_up")
		.on("click", e.click)
		.on("mouseover", e.upover)
		.on("mouseout", e.out);
		var draw_down = d3.select("#comutationplot_draw_down")
		.on("click", e.click)
		.on("mouseover", e.downover)
		.on("mouseout", e.out);
		var initial_button = d3.select("#comutationplot_initial_button")
		.on("click", e.init)
		.on("mouseover", e.initover)
		.on("mouseout", e.out);
	}
	
	return {
		view : view
	}
});