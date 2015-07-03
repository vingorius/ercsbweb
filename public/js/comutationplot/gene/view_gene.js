define("gene/view_gene", ["utils", "size", "gene/event_gene"], function(_utils, _size, _event)	{
	var view = function(_data)	{
		var data = _data || {};
		var size = data.size;
		var e = _event || null;

		var svg = d3.select("#comutationplot_gene")
		.append("svg")
		.attr("class", "comutationplot_gene")
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var xAxis = d3.svg.axis()
		.scale(data.x)
		.orient("bottom")
		.ticks(3);

		var yAxis = d3.svg.axis()
		.scale(data.y)
		.orient("right");

		svg.append("g")
		.attr("class", "gene_x_axis")
		.attr("transform", "translate(0, " + (size.height - size.margin.bottom) + ")")
		.call(xAxis);

		svg.append("g")
		.attr("class", "gene_y_axis")
		.attr("transform", "translate(" + (size.width - size.margin.right) + ", 0)")
		.call(yAxis)
		.selectAll("text")
		.on("mouseover", e.axis_m_over)
		.on("mouseout", e.axis_m_out);

		var bar_group = svg.selectAll(".genebar_group")
		.data(data.data)
		.enter().append("g")
		.attr("class", "genebar_group") 
		.attr("transform", "translate(0, 0)");

		var stacked_bar = bar_group.selectAll("rect")  
		.data(function(_d)  { return _d.list; })
		.enter().append("rect")
		.attr("class", function(_d, _i) { return "stacked_vbar_" + _d.gene + "-" + _i; })
		.attr("x", function(_d) { return data.x(_d.start + _d.count); })
		.attr("y", function(_d) { return data.y(_d.gene); })
		.attr("width", function(_d) { return ((size.width - size.margin.right) - data.x(_d.count)); })
		.attr("height", data.y.rangeBand() / 1.2)
		.style("fill", function(_d) { return _utils.colour(_d.type); })
		.style("stroke", function(_d) { return "#BFBFBF"; })
		.style("stroke-width", 0.5)
		.on("mouseover", e.bar_m_over)
		.on("mouseout",e.bar_m_out);
	}

	return {
		view : view
	}
});