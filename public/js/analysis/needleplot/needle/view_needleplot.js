var NEEDLE = "analysis/needleplot/needle/";

define(NEEDLE + "view_needleplot", ["utils", "size", NEEDLE + "event_needleplot"], function(_utils, _size, _event)    {
	var showPatient = function(_svg, _size, _x, _patient)	{
		var patient_group = _svg.selectAll("patient_group")
		.data(_patient)
		.enter().append("g")
		.attr("class", "patient_group")
		.attr("transform", function(_d) {
			return "translate( " + _x(_d.position)+ ", " + (_size.height - (_size.margin.top * 1.7)) + " )";
		});

		var patient_mutation = patient_group.append("path")
		.attr("class", "patient_mutation")
		.attr("d", d3.svg.symbol().type("triangle-up"))
		.attr("transform", "translate(0, 0)")
		.style("fill", function(_d)	{
			_d.target = "patient";
			return _utils.colour(_utils.definitionMutationName(_d.type));
		})
		.on("mouseover", _event.mover)
		.on("mouseout", _event.mout);
	}

	var view = function(_data)  {
		var size = _data.size;

		var svg = d3.select("#needleplot_view")
		.append("svg")
		.attr("class", "needleplot_view")
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var xAxis = d3.svg.axis()
		.scale(_data.x)
		.orient("bottom")
		.tickPadding(10);

		var yAxis = d3.svg.axis()
		.scale(_data.y)
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
		.data(_data.data.data.graph[0].regions)
		.enter().append("g")
		.attr("class", "graph_group")
		.attr("transform", function(_d) {
			if(_d.display) { 
				return "translate(" + _data.x(_d.start) + ", " + (size.rheight + size.graph_width) + ")"; 
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
		.on("mouseover", _event.mover)
		.on("mouseout", _event.mout)
		.attr("x", 0)
		.attr("y", -size.margin.top)
		.attr("width", 0)
		.transition().duration(400).delay(function(_d, _i)	{ 
			return _i * 100; 
		})
		.attr("width", function(_d) { 
			return _data.x(_d.end) - _data.x(_d.start); 
		})
		.attr("height", size.graph_width)
		.attr("rx", 3)
		.attr("ry", 3)
		.each("end", function()	{
			_utils.preserveEventInterrupt(this, 0);
		});

		var text_group = svg.selectAll(".text_group")
		.data(_data.data.data.graph[0].regions)
		.enter().append("g")
		.attr("class", "text_group")
		.attr("transform", function(_d)	{
			if(_d.display) { 
				return "translate(" + _data.x(_d.start) + ", " + (size.rheight + size.graph_width) + ")"; 
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
		.style("font-size", _data.fontsize)
		.text(function(_d) { 
			return _d.text; 
		});

		var marker_group = svg.selectAll(".marker_group")
		.data(_data.stacked)
		.enter().append("g")
		.attr("class", "marker_group")
		.attr("transform", function(_d) {
			return "translate(" + _data.x(_d.position) + ", " + (size.rheight) + ")";
		});

		var marker_figures_group = marker_group.selectAll(".marker_figures_group")
		.data(function(_d) { 
			return _d.public_list; 
		})
		.enter().append("g")
		.attr("class", "marker_figures_group")
		.attr("transform", null)
		.attr("transform", function(_d, _i) {
			return "translate(0, " + (_data.y(_d.y) - (size.rheight - size.graph_width)) + ")";
		});

		var marker_figures_path = marker_figures_group.append("path")
		.attr("class", "marker_figures_path")
		.attr("d", function(_d) { 
			return "M0,0L0,0"; 
		})
		.transition().duration(500)
		.attr("d", function(_d) {
			return "M0,0L0," + (_data.y(_d.count) - (size.rheight - size.graph_width));
		});

		var marker_figures_circle = marker_figures_group.append("circle")
		.attr("class", "marker_figures_circle preserve_events")
		.on("mouseover", _event.mover)
		.on("mouseout", _event.mout)
		.style("fill", function(_d) { 
			_d.target = "marker";
			return _utils.colour(_utils.definitionMutationName(_d.type)); 
		})
		.style("stroke", function(_d) { 
			return d3.rgb(_utils.colour(_utils.definitionMutationName(_d.type))).darker(2); 
		})
		.style("stroke-width", function(_d) { 
			return 0; 
		})
		.attr("cx", 0)
		.attr("cy", 0).transition().duration(500)
		.attr("cy", function(_d, _i) { 
			return (_data.y(_d.count) - (size.rheight - size.graph_width - _data.radius(_d.count))); 
		})
		.attr("r", function(_d, _i) { 
			return _data.radius(_d.count); 
		})
		.each("end", function()	{
			_utils.preserveEventInterrupt(this, 0);
		});

		_event.front();

		svg.append("g")
		.attr("class", "needleplot_title")
		.attr("transform", "translate(" + size.margin.left + ", " + size.margin.top + ")")
		.append("text")
		.text(_data.data.data.title)
		.style("font-size", "15px")
		.style("font-weight", "bold");

		if(_data.data.data.patient_list)	{
			showPatient(svg, size, _data.x, _data.data.data.patient_list);
		}
	}

	return {
		view : view
	}
});