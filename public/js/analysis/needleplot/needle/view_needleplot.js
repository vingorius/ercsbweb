var NEEDLE = "analysis/needleplot/needle/";

define(NEEDLE + "view_needleplot", ["utils", "size", NEEDLE + "event_needleplot"], function(_utils, _size, _event)    {
	var showPatient = function(_svg, _size, _event, _x, _patient)	{
		var patient_group = _svg.selectAll("patient_group")
		.data(_patient)
		.enter().append("g")
		.attr("class", "patient_group")
		.attr("transform", function(_d) {
			return "translate( " + _x(_d.position)+ ", " + (_size.height - (_size.margin.top * 1.7)) + " )";
		});

		var patientMutation = patient_group.append("path")
		.attr("class", "patient_mutation")
		.attr("d", d3.svg.symbol().type("triangle-up"))
		.attr("transform", "translate(0, 0)")
		.style("fill", function(_d)	{
			_d.target = "patient";
			return _utils.colour(_utils.define_mutation_name(_d.type));
		})
		.on("mouseover", _event.m_over)
		.on("mouseout", _event.m_out);
	}

	var view = function(_data)  {
		var data = _data || [];
		var size = data.size;
		var csize = data.csize;
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
		.orient("bottom")
		.tickPadding(10);

		var yAxis = d3.svg.axis()
		.scale(data.y)
		.orient("left")
		.ticks(5)
		.tickFormat(d3.format("d"))
		.tickSubdivide(0)
		.tickPadding(2)
		.innerTickSize(2)
		.outerTickSize(2);

		svg.append("g")
		.attr("class", "needle_x_axis")
		.attr("transform", "translate(0, " + (size.rheight + size.graph_width)+ ")")
		.call(xAxis);

		svg.append("g")
		.attr("class", "needle_y_axis")
		.attr("transform", "translate(" + size.margin.left + ", " + size.margin.top+ ")")
		.call(yAxis);

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
			if(_d.display) { 
				return "translate(" + data.x(_d.start) + ", " + (size.rheight + size.graph_width) + ")"; 
			}
			else { 
				d3.select(this).remove(); 
			}
		});

		var graphs = graph_group.append("rect")
		.attr("class", "graph_group_graphs preserve_events")
		.style("fill", function(_d) { 
			_d.target = "graph";
			return _d.colour; 
		})
		.on("mouseover", e.m_over)
		.on("mouseout", e.m_out)
		.attr("x", 0)
		.attr("y", -size.margin.top)
		.attr("width", 0)
		.transition().duration(400).delay(function(_d, _i)	{ 
			return _i * 100; 
		})
		.attr("width", function(_d) { 
			return data.x(_d.end) - data.x(_d.start); 
		})
		.attr("height", size.graph_width)
		.attr("rx", 3)
		.attr("ry", 3)
		.each("end", function()	{
			_utils.preserveInterrupt(this);
		});

		var text_group = svg.selectAll(".text_group")
		.data(data.data.data.graph[0].regions)
		.enter().append("g")
		.attr("class", "text_group")
		.attr("transform", function(_d)	{
			if(_d.display) { 
				return "translate(" + data.x(_d.start) + ", " + (size.rheight + size.graph_width) + ")"; 
			}
			else { 
				d3.select(this).remove(); 
			}
		});

		var graphs_text = text_group.append("text")
		.attr("class", "needle_graphs_text")
		.transition().duration(400).delay(function(_d, _i)	{ 
			return _i * 100; 
		})
		.attr("x", 3)
		.attr("y", -(size.graph_width / 3))
		.style("font-size", data.fontsize)
		.text(function(_d) { 
			return _d.text; 
		});

		var marker_group = svg.selectAll(".marker_group")
		.data(data.stacked)
		.enter().append("g")
		.attr("class", "marker_group")
		.attr("transform", function(_d) {
			return "translate(" + data.x(_d.position) + ", " + (size.rheight) + ")";
		});

		var marker_figures_group = marker_group.selectAll(".marker_figures_group")
		.data(function(_d) { return _d.public_list; })
		.enter().append("g")
		.attr("class", "marker_figures_group")
		.attr("transform", null)
		.attr("transform", function(_d, _i) {
			return "translate(0, " + (data.y(_d.y) - (size.rheight - size.graph_width)) + ")";
		});

		var marker_figures_path = marker_figures_group.append("path")
		.attr("class", "marker_figures_path")
		.attr("d", function(_d) { 
			return "M0,0L0,0"; 
		})
		.transition().duration(500)
		.attr("d", function(_d) {
			return "M0,0L0," + (data.y(_d.count) - (size.rheight - size.graph_width));
		});

		var marker_figures_circle = marker_figures_group.append("circle")
		.attr("class", "marker_figures_circle preserve_events")
		.on("mouseover",e.m_over)
		.on("mouseout", e.m_out)
		.style("fill", function(_d) { 
			_d.target = "marker";
			return _utils.colour(_utils.define_mutation_name(_d.type)); 
		})
		.style("stroke", function(_d) { 
			return d3.rgb(_utils.colour(_utils.define_mutation_name(_d.type))).darker(2); 
		})
		.style("stroke-width", function(_d) { 
			return 0; 
		})
		.attr("cx", 0)
		.attr("cy", 0).transition().duration(500)
		.attr("cy", function(_d, _i) { 
			return (data.y(_d.count) - (size.rheight - size.graph_width - data.radius(_d.count))); 
		})
		.attr("r", function(_d, _i) { 
			return data.radius(_d.count); 
		})
		.each("end", function()	{
			_utils.preserveInterrupt(this);
		});

		e.front();

		svg.append("g")
		.attr("class", "needleplot_title")
		.attr("transform", "translate(" + size.margin.left + ", " + size.margin.top + ")")
		.append("text")
		.text(data.data.data.title)
		.style("font-size", "15px")
		.style("font-weight", "bold");

		showPatient(svg, size, e, data.x, data.data.data.patient_list);
	}
	return {
		view : view
	}
});