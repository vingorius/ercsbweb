define("pq/view_pq", ["utils", "size", "pq/event_pq"], function(_utils, _size, _event)	{
	var view = function(_data)	{
		var data = _data || {};
		var size = data.size;
		var e = _event || null;

		var svg = d3.select("#comutationplot_pq")
		.append("svg")
		.attr("class", "comutationplot_pq")
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
		.orient("left");

		svg.append("g")
		.attr("class", "pq_x_axis")
		.attr("transform", "translate(0, " + (size.height - size.margin.bottom) + ")")
		.call(xAxis);

		svg.append("g")
		.attr("class", "pq_y_axis")
		.attr("transform", "translate(" + size.margin.left + ", 0)")
		.call(yAxis)
		.selectAll("text").text("");   

		svg.append("g")
		.attr("class", "pq_explain")
		.attr("transform", "translate(" + (size.rwidth + size.margin.left * 2) + ", " + (size.height - 2) + ")")
		.append("text")
		.text("#p value")
		.style("font-size", "12px")
		.style("font-style", "italic");

		var bar_group = svg.selectAll(".pqbar_group")
		.data(data.data)
		.enter().append("g")
		.attr("class", "pqbar_group") 
		.attr("transform", "translate(0, 0)");

		var stacked_bar = bar_group.selectAll("rect")  
		.data(function(_d)  { return _d.list; })
		.enter().append("rect")
		.attr("class", function(_d, _i) { return "pqbar stacked_vbar_" + _d.name + "-" + _i; })
		.attr("x", function(_d) { return size.margin.left; })
		.attr("y", function(_d) { return data.y(_d.name); })
		.attr("width", function(_d) { return data.x(_utils.log(_d.q)) - size.margin.left; })
		.attr("height", data.y.rangeBand() / 1.2)
		.style("fill", function(_d) { return "#BFBFBF"; })
		.style("stroke", function(_d) { return "#BFBFBF"; })
		.style("stroke-width", 0.5)
		.on("mouseover", e.m_over)
		.on("mouseout", e.m_out);
	}

	return {
		view : view
	}
});