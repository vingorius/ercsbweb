define("comutation/view_comutation", ["utils", "size", "comutation/event_comutation"], function(_utils, _size, _event)	{
	var view = function(_data)	{
		var data = _data || [];
		var size = data.size;
		var e = _event || null;

		var svg = d3.select("#comutationplot_mutationseq")
		.append("svg")
		.attr("class", "comutationplot_mutationseq")
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var xAxis = d3.svg.axis()
		.scale(data.x)
		.orient("bottom");

		var yAxis = d3.svg.axis()
		.scale(data.y)
		.orient("left");

		svg.append("g")
		.attr("class", "comutsheatmap_x_axis")
		.attr("transform", "translate(0, 0)")
		.call(xAxis);

		svg.append("g")
		.attr("class", "comutsheatmap_y_axis")
		.attr("transform", "translate(0, 0)")
		.call(yAxis);

		var cell_group = svg.selectAll(".comuts_cell_group")
		.data(data.all_data)
		.enter().append("g")
		.attr("class", "comuts_cell_group")
		.attr("transform", function(_d)	{
			return "translate(" + data.x(_d.sample) + ", " + data.y(_d.gene) +")";
		});

		var cell = cell_group.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", function(_d) { return data.x.rangeBand(); })
		.attr("height", function(_d) { return data.y.rangeBand() / 1.2; })
		.style("stroke", function(_d) { return _utils.colour(_d.type[0]); })
		.style("stroke-width", function(_d) { return 1; })
		.style("fill", function(_d) { return _utils.colour(_d.type[0]); })
		.on("mouseover", e.m_over)
		.on("mouseout", e.m_out);
	}

	return {
		view : view
	}
});