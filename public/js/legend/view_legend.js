define("legend/view_legend", ["utils", "size"], function(_utils, _size)    {
	var interface_figure = function(_data, _size, _svg, _type)	{
		switch(_data.figure(_type).figure)	{
			case "circle" : return circles(_data, _size, _svg, _type); break;
			case "rect" : return rectangle(_data, _size, _svg, _type); break;
			case "triangle" : return triangle(_data, _size, _svg, _type); break;
		}
	}

	var circles = function(_data, _size, _svg, _type)	{
		return _svg.append("circle")
		.attr("class", "legend_circles")
		.attr("cx", _data.location(_type).rx + _size.rect_size / 2)
		.attr("cy", _data.location(_type).ry + _size.rect_size / 2)
		.attr("r", _size.rect_size / 2);
	}

	var rectangle = function(_data, _size, _svg, _type)	{
		return _svg.append("rect")
		.attr("class", "legend_rect")
		.attr("x", _data.location(_type).rx)
		.attr("y", _data.location(_type).ry)
		.attr("width", _size.rect_size)
		.attr("height", _size.rect_size);
	}

	var triangle = function(_data, _size, _svg, _type)	{
		return _svg.append("path")
		.attr("class", "pcaplots_triangle")	
		.attr("d", d3.svg.symbol().type("triangle-up"))
		.attr("transform", "translate(" + _data.location(_type).rx +  ", " + _data.location(_type).ry + ")");
	}

	var view = function(_data)  {
		var size = _data.size;

		var svg = d3.select("#" + _data.id)
		.append("svg")
		.attr("class", _data.id)
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var legendGroup = svg.selectAll(".legendGroup")
		.data(_data.data.type_list)
		.enter().append("g")
		.attr("class", "legendGroup")
		.attr("transform", function(_d) {
			return "translate(" + size.margin.left + ", " + size.margin.top + ")";
		});

		if(_data.figure)	{
			for(var i = 0, len = _data.data.type_list.length ; i < len ; i++)	{
				var type = _data.data.type_list[i];

				interface_figure(_data, size, legendGroup, type)
				.style("fill", function(_d) { return _utils.colour(type); });
			}
		}
		else {
			var rect = legendGroup.append("rect")
			.attr("x", function(_d) { return _data.location(_d).rx; })
			.attr("y", function(_d) { return _data.location(_d).ry; })
			.attr("width", size.rect_size)
			.attr("height", size.rect_size)
			.style("fill", function(_d) { return _utils.colour(_d);});
		}

		var text = legendGroup.append("text")
		.attr("x", function(_d) { return _data.location(_d).tx; })
		.attr("y", function(_d) { return _data.location(_d).ty; })
		.text(function(_d) { return _d; });
	}

	return {
		view : view
	}
});