define("pcaplot2d/view_pcaplot2d", ["utils", "size", "pcaplot2d/event_pcaplot2d"], function(_utils, _size, _event)	{
	var circle = function(_data, _svg)	{
		return _svg.selectAll("circle")
		.data(_data.data.sample_list)
		.enter().append("circle")
		.attr("class", "pcaplots")
		.attr("cx", function(_d) { return _data.x(_d.PC1); })
		.attr("cy", function(_d) { return _data.y(_d.PC2); })
		.attr("r", function(_d) { return _data.radius; });
	}

	var rectangle = function(_data, _svg)	{
		return _svg.selectAll("rect")
		.data(_data.data.sample_list)
		.enter().append("rect")
		.attr("class", "pcaplots")
		.attr("x", function(_d) { return _data.x(_d.PC1); })
		.attr("y", function(_d) { return _data.y(_d.PC2); })
		.attr("width", function(_d) { return _data.radius; })
		.attr("height", function(_d) { return _data.radius; });
	}

	var view = function(_data)	{
		var data = _data || [];
		var size = data.size;
		var e = _event || null;

		var svg = d3.select("#pcaplot_view_2d")
		.append("svg")
		.attr("class", "pcaplot_view_2d")
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var xAxis = d3.svg.axis()
		.scale(data.x)
		.orient("bottom")
		.ticks(5);

		var yAxis = d3.svg.axis()
		.scale(data.y)
		.orient("left")
		.ticks(5);

		svg.append("g")
		.attr("class", "pca x axis")
		.attr("transform", "translate(0, " + size.rheight + ")")
		.call(xAxis);

		svg.append("g")
		.attr("class", "label_pcaplot_pc1")
		.attr("transform", "translate(" + (size.rwidth / 2) + ", " 
			+ (size.height - size.margin.top) + ")")
		.append("text")
		.text("PC1");

		svg.append("g")
		.attr("class", "pca y axis")
		.attr("transform", "translate(" + size.margin.left + ", 0)")
		.call(yAxis);

		svg.append("g")
		.attr("class", "label_pcaplot_pc2")
		.attr("transform", "translate(" + (size.margin.left / 2) + ", " 
			+ (size.rheight / 2) + ")")
		.append("text")
		.text("PC2")
		.attr("transform", "rotate(-90)");

		var plot = svg.selectAll("circle")
		.data(data.data.sample_list)
		.enter().append("circle")
		.attr("class", "pcaplots")
		.attr("cx", function(_d) { return data.x(_d.PC1); })
		.attr("cy", function(_d) { return data.y(_d.PC2); })
		.attr("r", function(_d) { return data.radius; })
		.style("stroke", function(_d) { return _utils.colour(_d.TYPE); })
		.style("fill", function(_d) { return _utils.colour(_d.TYPE); })
		.on("mouseover", e.m_over)
		.on("mouseout", e.m_out);
	}

	return {
		view : view
	}
});