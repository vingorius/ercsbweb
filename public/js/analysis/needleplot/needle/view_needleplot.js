var NEEDLE = "analysis/needleplot/needle/";

define(NEEDLE + "view_needleplot", ["utils", "size", NEEDLE + "event_needleplot"], function(_utils, _size, _event)    {
	var showPatient = function(_svg, _size, _x, _patient)	{
		var patient_group = _svg.selectAll(".needleplot_patient_group")
		.data(_patient)
		.enter().append("g")
		.attr("class", "needleplot_patient_group")
		.attr("transform", function(_d) {
			return "translate( " + _x(_d.position)+ ", " + (_size.height - (_size.margin.top * 1.7)) + " )";
		});

		var needleplot_patient_mutation = patient_group.append("path")
		.attr("class", "needleplot_patient_mutation")
		.attr("d", d3.svg.symbol().type("triangle-up"))
		.attr("transform", "translate(0, 0)")
		.style("fill", function(_d)	{
			_d.target = "patient";
			return _utils.colour(_utils.defMutName(_d.type));
		})
		.style("stroke", "#fff").style("stroke-width", "0px")
		.on("mouseover", _event.mover)
		.on("mouseout", _event.mout);
	}

	var drawGenepath = function(_svg, _size)	{
		_svg.append("g")
		.attr("class", "needleplot_gene_fullpath_group")
		.attr("transform", "translate(0, " + (_size.rheight + _size.graph_width + (_size.graph_width - (_size.graph_width / 1.5)) / 2) + ")")
		.append("rect")
		.style("fill", "#DADFE1")
		.attr("x", _size.margin.left)
		.attr("y", -(_size.margin.top))
		.attr("width", _size.rwidth - _size.margin.left)
		.attr("height", _size.graph_width / 1.5);
	}

	var view = function(_data)  {
		var size = _data.size;
		var svg = _size.mkSvg("#needleplot_view", size.width, size.height);

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

		drawGenepath(svg, size);

		var xaxis = svg.append("g")
		.attr("class", "needleplot_xaxis")
		.attr("transform", "translate(0, " + (size.rheight + size.graph_width)+ ")")
		.call(xAxis);

		var yaxis = svg.append("g")
		.attr("class", "needleplot_yaxis")
		.attr("transform", "translate(" + size.margin.left + ", " + size.margin.top+ ")")
		.call(yAxis);

		xaxis.selectAll("text")
		.style("font-size", "10px");

		yaxis.selectAll("text")
		.style("font-size", "10px");

		xaxis.selectAll("path, line")
		.style("fill", "none").style("stroke", "#BFBFBF").style("stroke-width", "1px").style("shape-rendering", "crispEdges");

		yaxis.selectAll("path, line")
		.style("fill", "none").style("stroke", "#BFBFBF").style("stroke-width", "1px").style("shape-rendering", "crispEdges");

		var graph_group = svg.selectAll(".needleplot_graph_group")
		.data(_data.data.data.graph)
		.enter().append("g")
		.attr("class", "needleplot_graph_group")
		.attr("transform", function(_d) {
			if(_d.display === 1) { 
				return "translate(" + _data.x(_d.start) + ", " + (size.rheight + size.graph_width) + ")"; 
			}
			else { 
				d3.select(this).remove(); 
			}
		});

		var graph_g = graph_group.append("g")
		.attr("class", "needleplot_graph_g")
		.attr("transform", "translate(0, 0)");

		var graph_rect = graph_g.append("rect")
		.attr("class", "needleplot_graph_group_graphs preserve_events")
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
			return _i * 10; 
		})
		.attr("width", function(_d) { 
			return _data.x(_d.end) - _data.x(_d.start); 
		})
		.attr("height", size.graph_width)
		.attr("rx", 3)
		.attr("ry", 3)
		.each("end", function()	{
			_utils.preserveInterrupt(this, 0);
		});

		var graphs_text = graph_g.append("text")
		.attr("class", "needleplot_graph_intext")
		.transition().duration(400).delay(function(_d, _i)	{ 
			return _i * 10; 
		})
		.attr("x", 3)
		.attr("y", -(size.graph_width / 3))
		.style("fill", "#fff")
		.style("font-size", _data.fontsize)
		.text(function(_d) { 
			return _d.identifier; 
		});

		var marker_group = svg.selectAll(".needleplot_marker_group")
		.data(_data.stacked)
		.enter().append("g")
		.attr("class", "needleplot_marker_group")
		.attr("transform", function(_d) {
			return "translate(" + _data.x(_d.position) + ", " + (size.rheight) + ")";
		});

		var marker_figures_group = marker_group.selectAll(".needleplot_marker_figure_group")
		.data(function(_d) { 
			return _d.public_list; 
		})
		.enter().append("g")
		.attr("class", "needleplot_marker_figure_group")
		.attr("transform", null)
		.attr("transform", function(_d, _i) {
			return "translate(0, " + (_data.y(_d.y) - (size.rheight - size.graph_width)) + ")";
		});

		var marker_figures_path = marker_figures_group.append("path")
		.attr("class", "needleplot_marker_figure_inpath")
		.attr("d", function(_d) { 
			return "M0,0L0,0"; 
		})
		.transition().duration(500)
		.attr("d", function(_d) {
			return "M0,0L0," + (_data.y(_d.count) - (size.rheight - size.graph_width));
		})
		.style("fill", "none").style("stroke", "#BFBFBF").style("stroke-width", "1px").style("shape-rendering", "crispEdges");

		var marker_figures_circle = marker_figures_group.append("circle")
		.attr("class", "needleplot_marker_figure_incircle preserve_events")
		.on("mouseover", _event.mover)
		.on("mouseout", _event.mout)
		.style("fill", function(_d) { 
			_d.target = "marker";
			return _utils.colour(_utils.defMutName(_d.type)); 
		})
		.style("stroke", function(_d) { 
			return d3.rgb(_utils.colour(_utils.defMutName(_d.type))).darker(2); 
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
			_utils.preserveInterrupt(this, 0);
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