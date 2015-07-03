define("sample/view_sample", ["utils", "size", "sample/event_sample"], function(_utils, _size, _event)	{
	var view = function(_data)	{
		var data = _data || {};
		var size = data.size;
		var e = _event || null;

		var svg = d3.select("#comutationplot_sample")
		.append("svg")
		.attr("class", "comutationplot_sample")
		.attr("width", size.width - size.margin.left)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var xAxis = d3.svg.axis()
		.scale(data.x)
		.orient("bottom");

		var yAxis = d3.svg.axis()
		.scale(data.y)
		.orient("left")
		.ticks(3);

		svg.append("g")
		.attr("class", "sample_x_axis")
		.attr("transform", "translate(0, " + (size.height - size.margin.bottom) + ")")
		.call(xAxis);

		svg.append("g")
		.attr("class", "sample_y_axis")
		.attr("transform", "translate(" + size.margin.left + ", 0)")
		.call(yAxis);

		svg.append("g")
		.attr("class", "sample_explain")
		.attr("transform", "translate(" + (size.margin.left * 1.5) + ", " + (size.margin.top * 1.5) + ")")
		.append("text")
		.text("#samples count")
		.style("font-size", "12px")
		.style("font-style", "italic");

		var bar_group = svg.selectAll(".samplebar_group")
		.data(data.data)
		.enter().append("g")
		.attr("class", "samplebar_group") 
		.attr("transform", "translate(0, 0)");

		var stacked_bar = bar_group.selectAll("rect")  
		.data(function(_d)  { return _d.list; })
		.enter().append("rect")
		.attr("class", function(_d, _i) { return "stacked_hbar_" + _d.sample + "-" + _i; })
		.attr("x", function(_d) { return data.x(_d.sample); })
		.attr("y", function(_d) { return data.y(_d.start + _d.count); })
		.attr("width", data.x.rangeBand())
		.attr("height", function(_d) { return (size.height - size.margin.bottom) - data.y(_d.count); })
		.style("fill", function(_d) { return _utils.colour(_d.type); })
		.on("mouseover", e.m_over)
		.on("mouseout", e.m_out);

		e.move_scroll();
	}

	return {
		view : view
	}
});