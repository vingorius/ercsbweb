var NEEDLE = "needleplot/needle/";

define(NEEDLE + "view_needleplot", ["utils", "size", NEEDLE + "event_needleplot"], function(_utils, _size, _event)    {
	var needleplot_yaxis = function(_max)  {
		var size = _size.define_size("needleplot_yaxis", 20, 20, 0, 0);

		var svg = d3.select("#needleplot_yaxis")
		.append("svg")
		.attr("class", "needleplot_yaxis")
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var y = _utils.linearScale(_max, 0, size.margin.top, 
			(size.rheight - size.margin.top)).clamp(true);

		var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

		svg.append("g")
		.attr("class", "needle_y_axis")
		.attr("transform", "translate(" + size.width + ", " + size.margin.top + ")")
		.call(yAxis);
	}

	var view = function(_data)  {
		var data = _data || [];
		var size = data.size;
		var e = _event || null;

		var svg = d3.select("#needleplot_view")
		.append("svg")
		.attr("class", "needleplot_view")
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var xAxis = d3.svg.axis()
		.scale(data.x)
		.orient("bottom");

		svg.append("g")
		.attr("class", "needle_x_axis")
		.attr("transform", "translate(0, " + (size.rheight + size.graph_width)+ ")")
		.call(xAxis);

		needleplot_yaxis(data.ymax);

		svg.append("g")
		.attr("class", "needle_gene_full_path_g")
		.attr("transform", "translate(0, " + (size.rheight + size.graph_width + (size.graph_width - (size.graph_width / 1.5)) / 2) + ")")
		.append("rect")
		.attr("x", size.margin.left)
		.attr("y", -(size.margin.top))
		.attr("width", size.rwidth - size.margin.left)
		.attr("height", size.graph_width / 1.5);

		var graph_group = svg.selectAll(".graph_group")
		.data(data.data.data.graph[0].regions)
		.enter().append("g")
		.attr("class", "graph_group")
		.attr("transform", function(_d) {
			if(_d.display) { return "translate(" + data.x(_d.start) + ", "
				+ (size.rheight + size.graph_width) + ")"; }
			else { d3.select(this).remove(); }
		});

		var graphs = graph_group.append("rect")
		.style("fill", function(_d) { return _d.colour; })
		.attr("x", 0)
		.attr("y", -size.margin.top)
		.attr("width", 0)
		.transition().duration(400).delay(function(_d, _i)	{ return _i * 100; })
		.attr("width", function(_d) { return data.x(_d.end) - data.x(_d.start); })
		.attr("height", size.graph_width)
		.attr("rx", 3).attr("ry", 3);

		var text_group = svg.selectAll(".text_group")
		.data(data.data.data.graph[0].regions)
		.enter().append("g")
		.attr("class", "text_group")
		.attr("transform", function(_d)	{
			if(_d.display) { return "translate(" + data.x(_d.start) + ", "
				+ (size.rheight + size.graph_width) + ")"; }
			else { d3.select(this).remove(); }
		});

		var graphs_text = text_group.append("text")
		.attr("class", "needle_graphs_text")
		.transition().duration(400).delay(function(_d, _i)	{ return _i * 100; })
		.attr("x", 3)
		.attr("y", -(size.graph_width / 3))
		.text(function(_d) { return _d.text; });

		var marker_group = svg.selectAll(".marker_group")
		.data(data.stacked)
		.enter().append("g")
		.attr("class", "marker_group")
		.attr("transform", function(_d) {
			return "translate(" + data.x(_d.position) + ", " + (size.rheight) + ")";
		});

		var marker_figures_group = marker_group.selectAll(".marker_figures_group")
		.data(function(_d) { return _d.sample_list; })
		.enter().append("g")
		.attr("class", "marker_figures_group")
		.attr("transform", null)
		.attr("transform", function(_d, _i) {
			return "translate(0, " + (data.y(_d.y) - (size.rheight - size.graph_width)) + ")";
		});

		var marker_figures_path = marker_figures_group.append("path")
		.attr("class", "marker_figures_path")
		.attr("d", function(_d) { return "M0,0L0,0"; })
		.transition().duration(500)
		.attr("d", function(_d) {
			return "M0,0L0," + (data.y(_d.count) - (size.rheight - size.graph_width));
		});

		var marker_figures_circle = marker_figures_group.append("circle")
		.attr("class", "marker_figures_circle")
		.on("mouseover",e.m_over)
		.on("mouseout", e.m_out)
		.style("fill", function(_d) { return _utils.colour(_utils.define_mutation_name(_d.type)); })
		.style("stroke", function(_d) { return d3.rgb(_utils.colour(_utils.define_mutation_name(_d.type))).darker(2); })
		.style("stroke-width", function(_d) { return 0; })
		.attr("cx", 0)
		.attr("cy", 0)
		.transition().duration(500)
		.attr("cy", function(_d, _i) { return (data.y(_d.count) - (size.rheight - size.graph_width - data.radius(_d.count))); })
		.attr("r", function(_d, _i) { return data.radius(_d.count); });

		e.front();
	}

	return {
		view : view
	}
});