var MA = "maplot/";

define(MA + "view_maplot", ["utils", "size", MA + "event_maplot"], function(_utils, _size, _event) {
	var side_menu = function(_e)   {
		$("#maplot_result").append($("#maplot_result_view"));
		$('.spinner .btn:first-of-type').on("click", _e.arrow);
		$('.spinner .btn:last-of-type').on("click", _e.arrow);
		$("#redraw_button").on("click", _e.redraw);
		$("#download_button").on("click", _e.download);
		$("#reset_button").on("click", _e.reset);
		$("#undo_button").on("click", _e.undo);
	}

	var view = function(_data)  {
		var size = _data.size;

		var svg = d3.select("#maplot_view")
		.append("svg")
		.attr("class", "maplot_view")
		.attr("width", size.width)
		.attr("height", size.height)

		svg.append("g")
		.attr("transform", "translate(0, 0)");

		var maplot_path_g = svg.append("g")
        	.attr("id", "maplot_select_line");

		var xAxis = d3.svg.axis()
		.scale(_data.x)
		.orient("bottom")
		.ticks(4);

		var yAxis = d3.svg.axis()
		.scale(_data.y)
		.orient("left")
		.ticks(5);

		var xaxis = svg.append("g")
		.attr("class", "maplot_xaxis")
		.attr("transform", "translate(0, " + size.rheight + ")")
		.call(xAxis);

		var yaxis = svg.append("g")
		.attr("class", "maplot_yaxis")
		.attr("transform", "translate(" + (size.margin.left + size.margin.right) + ", 0)")
		.call(yAxis);

		xaxis.selectAll("path, line")
        	.style("fill", "none").style("stroke", "#BFBFBF").style("stroke-width", "1").style("shape-rendering", "crispEdges");

        	yaxis.selectAll("path, line")
        	.style("fill", "none").style("stroke", "#BFBFBF").style("stroke-width", "1").style("shape-rendering", "crispEdges");

		var circles = svg.selectAll("circle")
		.data(_data.data.data.plot_list)
		.enter().append("circle")
		.attr("class", "maplot_circles")
		.style("fill", function(_d) { 
			return _data.color(_d, _data.cut_off); 
		});

		_data.all_circles = circles;
		var e = _event(_data) || null;
		side_menu(e);

		svg.call(e.drag);

		circles
		.on("mouseover", e.m_over)
		.on("mouseout", e.m_out)
		.transition().delay(function(_d, _i) { 
			return _i * (1 / 5); 
		})
		.attr("r", 2)
		.attr("cx", function(_d) { 
			return _data.x(_d.x); 
		})
		.attr("cy", function(_d) { 
			return _data.y(_d.y); 
		});
	}

	return {
		view : view
	}
	
});