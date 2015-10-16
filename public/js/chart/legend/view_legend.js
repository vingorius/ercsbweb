define("chart/legend/view_legend", ["utils", "size", "chart/legend/event_legend"], function(_utils, _size, _event)    {
	var interfaceComutation = function(_data, _g)	{
		for(var i = 0, len = _data.data.type_list.length ; i < len ; i++)	{
			var type = _data.data.type_list[i];
			var name = _utils.defMutName(type.name);

			switch(type.alteration)	{
				case "CNV" : 
					figureRect(_g, "cnv", { data : _data, name : name, width : 4.5, height : 15, fill : _utils.colour(name) });
				break;
				case "mRNA Expression (log2FC)" :  
					figureRect(_g, "exp", { data : _data, name : name, width : 4.5, height : 15, stroke : _utils.colour(name) });
				break;
				case "Somatic Mutaion" : 
					figureRect(_g, "somatic", { data : _data, name : name, y : 5, width : 4.5, height : 5, fill : _utils.colour(name) });
				break;
			}
		}
	}

	var interfaceNeedle = function(_data, _g)	{
		for(var i = 0, len = _data.data.type_list.length ; i < len ; i++)	{
			var type = _data.data.type_list[i];
			var name = _utils.defMutName(type.name);

			figureCircle(_g, "needleplot", { data : _data, name : name, radius : 3, cy : 8, fill : _utils.colour(name) });
		}
	}

	var interfacePca = function(_data, _g)	{
		for(var i = 0, len = _data.data.type_list.length ; i < len ; i++)	{
			var type = _data.data.type_list[i];

			switch(type.name)	{
				case "Primary Solid Tumor" :
					figureCircle(_g, "pcaplot", { data : _data, name : type.name, radius : 5, cx : 5, cy : 7.5, fill : _utils.colour(type.name) });
				break; 
				case "Solid Tissue Normal" : 
					figureRect(_g, "pcaplot", { data : _data, name : type.name, y : 3, width : 10, height : 10, fill : _utils.colour(type.name) });
				break;
			}
		}
	}

	var figureCircle = function(_element, _id, _data)	{
		var arranged = _data.data.arranged(_data.name, "figure", _data.data.size_set, _data.data.size);

		return _element.append("circle")
		.attr("class", "legend_figure_" + _id)
		.attr("cx", arranged.x + (_data.cx || 0))
		.attr("cy", arranged.y + (_data.cy || 0))
		.attr("r", _data.radius || 0)
		.style("fill", _data.fill ? _data.fill : "none")
		.style("stroke", _data.stroke ? _data.stroke : "none")
		.style("stroke-width", _data.stroke ? _data.stroke : "none");
	}

	var figureRect = function(_element, _id, _data)	{
		var arranged = _data.data.arranged(_data.name, "figure", _data.data.size_set, _data.data.size);

		return _element.append("rect")
		.attr("class", "legend_figure_" + _id)
		.attr("x", arranged.x + (_data.x || 0))
		.attr("y", arranged.y + (_data.y || 0))
		.attr("width", _data.width || 0)
		.attr("height", _data.height || 0)
		.style("fill", _data.fill || "none")
		.style("stroke", _data.stroke || "none")
		.style("stroke-width", _data.stroke || "none");
	}

	var view = function(_data)  {
		var size = _data.size;
		var svg = _size.mkSvg("#" + _data.id, size.width, size.height);

		var legendGroup = svg.selectAll(".legendGroup")
		.data(_data.data.type_list)
		.enter().append("g")
		.attr("class", "legendGroup")
		.attr("transform", "translate(" + size.margin.left + ", " + size.margin.top + ")");

		switch(_data.chart)	{
			case "comutation" : interfaceComutation(_data, legendGroup); break;
			case "needleplot" : interfaceNeedle(_data, legendGroup); break;
			case "pcaplot" : interfacePca(_data, legendGroup); break;
		}

		var text = legendGroup.append("text")
		.attr("class", "legend_text")
		.style("font-size", "11px")
		.on("mouseover", _event.mouseover)
		.on("mouseout", _event.mouseout)
		.attr("x", function(_d) { 
			return _data.arranged(_d.name, "text", _data.size_set, size).x; 
		})
		.attr("y", function(_d) { 
			return _data.arranged(_d.name, "text", _data.size_set, size).y; 
		})
		.text(function(_d) { 
			return _d.name; 
		});
	}
	return {
		view : view
	}
});