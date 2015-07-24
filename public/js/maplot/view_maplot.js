var MA = "maplot/";

define(MA + "view_maplot", ["utils", "size", MA + "event_maplot"], function(_utils, _size, _event) {
	var side_menu = function(_e)   {
		var div = $("#maplot_result");
		var input = $("#maplot_result_view");
		var redraw = $("#redraw_button");
		var download = $("#download_button");
		var reset = $("#reset_button");
		var undo = $("#undo_button");

		div.append(input);

		$('.spinner .btn:first-of-type').on("click", _e.arrow);
		$('.spinner .btn:last-of-type').on("click", _e.arrow);

		redraw.on("click", _e.redraw);
		download.on("click", _e.download);
		reset.on("click", _e.reset);
		undo.on("click", _e.undo);
	}

	var view = function(_data)  {
		var data = _data || {};
		var size = data.size;

		var svg = d3.select("#maplot_view")
		.append("svg")
		.attr("class", "maplot_view")
		.attr("width", size.width)
		.attr("height", size.height)

		svg.append("g")
		.attr("transform", "translate(0, 0)");

		var maplot_path_g = svg.append("g")
        		.attr("id", "maplot_select_path");

		var xAxis = d3.svg.axis()
		.scale(data.x).orient("bottom").ticks(4);

		var yAxis = d3.svg.axis()
		.scale(data.y).orient("left").ticks(5);

		svg.append("g")
		.attr("class", "maplot_xaxis")
		.attr("transform", "translate(0, " + size.rheight + ")")
		.call(xAxis);

		svg.append("g")
		.attr("class", "maplot_yaxis")
		.attr("transform", "translate(" + (size.margin.left + size.margin.right) + ", 0)")
		.call(yAxis);

		var circles = svg.selectAll("circle")
		.data(data.data.data.plot_list)
		.enter().append("circle")
		.attr("class", "maplot_circles")
		.style("fill", function(_d) { return data.color(_d, data.cut_off); });

		data.all_circles = circles;
		var e = _event(data) || null;
		side_menu(e);

		svg.call(e.drag);

		circles
		.on("mouseover", e.m_over).on("mouseout", e.m_out)
		.transition().delay(function(_d, _i) { return _i * (1 / 5); })
		.attr("r", 2)
		.attr("cx", function(_d) { return data.x(_d.x); })
		.attr("cy", function(_d) { return data.y(_d.y); });
	}

	return {
		view : view
	}
	
});