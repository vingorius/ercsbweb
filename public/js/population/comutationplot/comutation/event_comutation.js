var COMUTATION = "population/comutationplot/comutation/";

define(COMUTATION + "event_comutation", ["utils", "size"], function(_utils, _size)	{
	var event_mouseover = function(_d)	{
		var target = d3.select(this);
		var e = d3.event;

		this.parentNode.parentNode.appendChild(this.parentNode);

		_utils.tooltip(
			e, 
			"x : <span style='color : red;'>"  
			+ _d.sample 
			+ "</span></br>y : <span style='color : red;'>" 
			+ _d.gene
			+ "</span>",
			e.pageX, e.pageY
		);

		target.transition().duration(10)
		.style("stroke", "black")
		.style("stroke-width", 1);
	}

	var event_mouseout = function(_d)	{
		var target = d3.select(this);

		_utils.tooltip();

		target.transition().duration(10)
		.style("stroke", function(_d) { 
			return _utils.colour(_utils.define_mutation_name(_d.type)); 
		})
		.style("stroke-width", function(_d) { 
			return 0.1; 
		});
	}

	var move_scroll = function()	{
		var target_1 = $("#comutationplot_sample");
		// var target_2 = $("#comutationplot_heatmap");
		var target_2 = $("#comutationplot_border");
		var target_3 = $("#comutationplot_groups");

		target_2.scroll(function()	{
			var scroll = target_2.scrollLeft();
			
			target_1.scrollLeft(scroll);
			target_3.scrollLeft(scroll);
		});
	}
	return {
		m_over : event_mouseover,
		m_out : event_mouseout,
		move_scroll : move_scroll
	}
})