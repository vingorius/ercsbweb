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
		.tickValues([0, data.max / 2, data.max]);

		var yAxis = d3.svg.axis()
		.scale(data.y)
		.orient("right");

		svg.append("g")
		.attr("class", "comutationplot_gene_xaxis")
		.attr("transform", "translate(0, " + (size.height - size.margin.top) + ")")
		.call(xAxis);

		svg.append("g")
		.attr("class", "comutationplot_gene_yaxis")
		.attr("transform", "translate(" + (size.width - size.margin.right) + ", 0)")
		.call(yAxis)
		.selectAll("text")
		.on("mouseover", e.axis_m_over)
		.on("mouseout", e.axis_m_out);

		svg.append("g")
		.attr("class", "pq_explain")
		.attr("transform", "translate(" + (size.rwidth + size.margin.left * 2) + ", " + (size.height - 2) + ")")
		.append("text")
		.text("#mutations")
		.style("font-size", "12px")
		.style("font-style", "italic");

		var bar_group = svg.selectAll(".comutationplot_gene_bargroup")
		.data(data.data)
		.enter().append("g")
		.attr("class", "comutationplot_gene_bargroup") 
		.attr("transform", "translate(0, 0)");

		var stacked_bar = bar_group.selectAll("rect")  
		.data(function(_d)  { return _d.list; })
		.enter().append("rect")
		.attr("class", "comutationplot_gene_bars")
		.attr("x", function(_d) { return data.x(_d.start + _d.count); })
		.attr("y", function(_d) { return data.y(_d.gene); })
		.attr("width", function(_d) { return ((size.width - size.margin.right) - data.x(_d.count)); })
		.attr("height", data.y.rangeBand() / 1.2)
		.style("fill", function(_d) { return _utils.colour(_d.type); })
		.on("mouseover", e.bar_m_over)
		.on("mouseout",e.bar_m_out);
	}

	return {
		view : view
	}
});