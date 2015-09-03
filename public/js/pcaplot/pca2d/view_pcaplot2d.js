var _2D = "pcaplot/pca2d/";

define(_2D + "view_pcaplot2d", ["utils", "size", _2D + "event_pcaplot2d"], function(_utils, _size, _event)	{
	var interfaceFigure = function(_data, _x, _y, _svg, _type)	{
		switch(_type)	{
			case "circle" : 
				return circles(_data, _x, _y, _svg); 
			break;
			case "rect" : 
				return rectangle(_data, _x, _y, _svg); 
			break;
			case "triangle" : 
				return triangle(_data, _x, _y, _svg); 
			break;
		}
	}

	var circles = function(_data, _x, _y, _svg)	{
		return _svg.append("circle")
		.attr("class", "pcaplots_circles")
		.attr("cx", _data.x(_x))
		.attr("cy", _data.y(_y))
		.attr("r", _data.radius);
	}

	var rectangle = function(_data, _x, _y, _svg)	{
		return _svg.append("rect")
		.attr("class", "pcaplots_rect")
		.attr("x", _data.x(_x) - _data.radius)
		.attr("y", _data.y(_y) - _data.radius)
		.attr("width", _data.radius * 2)
		.attr("height", _data.radius * 2);
	}

	var triangle = function(_data, _x, _y, _svg)	{
		return _svg.append("path")
		.attr("class", "pcaplots_triangle")	
		.attr("d", d3.svg.symbol().type("triangle-up"))
		.attr("transform", "translate(" + _data.x(_x) +  ", " + _data.y(_y) + ")");
	}

	var view = function(_data)	{
		var size = _data.size;

		var svg = d3.select("#pcaplot_view_2d")
		.append("svg")
		.attr("class", "pcaplot_view_2d")
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var xAxis = d3.svg.axis()
		.scale(_data.x)
		.orient("bottom")
		.ticks(5);

		var yAxis = d3.svg.axis()
		.scale(_data.y)
		.orient("left")
		.ticks(5);

		svg.append("g")
		.attr("class", "pca x axis")
		.attr("transform", "translate(0, " + size.rheight + ")")
		.call(xAxis);

		svg.append("g")
		.attr("class", "label_pcaplot_pc1")
		.attr("transform", "translate(" + (size.rwidth / 2) + ", " + (size.height - size.margin.top) + ")")
		.append("text")
		.text("PC1");

		svg.append("g")
		.attr("class", "pca y axis")
		.attr("transform", "translate(" + size.margin.left + ", 0)")
		.call(yAxis);

		svg.append("g")
		.attr("class", "label_pcaplot_pc2")
		.attr("transform", "translate(" + (size.margin.left / 2) + ", " + (size.rheight / 2) + ")")
		.append("text")
		.text("PC2")
		.attr("transform", "rotate(-90)");

		for(var i = 0, len = _data.data.sample_list.length ; i < len ; i++)	{
			var pca = _data.data.sample_list[i];

			interfaceFigure(_data, pca.PC1, pca.PC2, svg, _data.type(pca.TYPE).figure)
			.data([pca])
			.on("mouseover", _event.m_over)
			.on("mouseout", _event.m_out)
			.style("stroke", function(_d) { 
				return _utils.colour(pca.TYPE); 
			})
			.style("fill", function(_d) { 
				return _utils.colour(pca.TYPE); 
			});
		}
	}

	return {
		view : view
	}
});