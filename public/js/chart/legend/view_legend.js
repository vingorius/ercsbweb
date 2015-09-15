var LEGEND = "chart/legend/";

define(LEGEND + "view_legend", ["utils", "size", LEGEND + "event_legend"], function(_utils, _size, _event)    {
	var interfaceAlteration = function(_data, _g)	{
		for(var i = 0, len = _data.data.type_list.length ; i < len ; i++)	{
			var type = _data.data.type_list[i];
			var figure = makeFigureAlteration(_data, _g, type.alteration, type.name);			
		}
	}

	var makeFigureAlteration = function(_data, _g, _alteration, _name)	{
		switch(_alteration)	{
			case "CNV" : 
				return figureOfCnv(_data, _g, _name);
			break;
			case "mRNA Expression (log2FC)" :  
				return figureOfExp(_data, _g, _name);
			break;
			case "Somatic Mutaion" : 
				return figureOfSomatic(_data, _g, _name);
			break;
		}
	}

	var figureOfCnv = function(_data, _g, _name)	{
		var width = 4.5;
		var height = 15;

		return _g.append("rect")
		.attr("class", "legend_figure_cnv")
		.style("fill", _utils.colour(_utils.defMutName(_name)))
		.attr("x", _data.arranged(_name, "figure", _data.size_set, _data.size).x)
		.attr("y", _data.arranged(_name, "figure", _data.size_set, _data.size).y)
		.attr("width", width)
		.attr("height", height);
	}

	var figureOfExp = function(_data, _g, _name)	{
		var width = 4.5;
		var height = 15;

		return _g.append("rect")
		.attr("class", "legend_figure_exp")
		.style("fill", "#fff")
		.style("stroke", _utils.colour(_utils.defMutName(_name)))
		.attr("x", _data.arranged(_name, "figure", _data.size_set, _data.size).x)
		.attr("y", _data.arranged(_name, "figure", _data.size_set, _data.size).y)
		.attr("width", width)
		.attr("height", height);
	}

	var figureOfSomatic = function(_data, _g, _name)	{
		var width = 4.5;
		var height = 15;

		return _g.append("rect")
		.attr("class", "legend_figure_somatic")
		.style("fill", _utils.colour(_utils.defMutName(_name)))
		.attr("x", _data.arranged(_name, "figure", _data.size_set, _data.size).x)
		.attr("y", (_data.arranged(_name, "figure", _data.size_set, _data.size).y + height) - 10)
		.attr("width", width)
		.attr("height", height / 3);
	}

	var interfaceNeedleplot = function(_data, _g)	{
		for(var i = 0, len = _data.data.type_list.length ; i < len ; i++)	{
			var type = _data.data.type_list[i];
			var figure = figureOfNeedleplot(_data, _g, type.name);
		}
	}

	var figureOfNeedleplot = function(_data, _g, _name)	{
		var radius = 15;

		return _g.append("circle")
		.attr("class", "legend_figure_needleplot")
		.style("fill", _utils.colour(_utils.defMutName(_name)))
		.attr("cx", _data.arranged(_name, "figure", _data.size_set, _data.size).x)
		.attr("cy", (_data.arranged(_name, "figure", _data.size_set, _data.size).y + radius) - 7)
		.attr("r", radius / 5);
	}
	
	var interfacePcaPlot = function(_data, _g)	{
		for(var i = 0, len = _data.data.type_list.length ; i < len ; i++)	{
			var type = _data.data.type_list[i];
			var figure = makeFigurePca(_data, _g, type.name);
		}
	}

	var makeFigurePca = function(_data, _g, _name)	{
		switch(_name)	{
			case "Primary Solid Tumor" :
				return figureOfPcaplot1(_data, _g, _name);
			break; 
			case "Solid Tissue Normal" : 
				return figureOfPcaplot2(_data, _g, _name);
			break;
		}
	}

	var figureOfPcaplot1 = function(_data, _g, _name)	{
		var radius = 5;

		return _g.append("circle")
		.attr("class", "legend_figure_pcaplot")
		.style("fill", _utils.colour(_name))
		.attr("cx", _data.arranged(_name, "figure", _data.size_set, _data.size).x + radius)
		.attr("cy", _data.arranged(_name, "figure", _data.size_set, _data.size).y + radius * 1.5)
		.attr("r", radius);
	}

	var figureOfPcaplot2 = function(_data, _g, _name)	{
		var rect_size = 10;

		return _g.append("rect")
		.attr("class", "legend_figure_pcaplot")
		.style("fill", _utils.colour(_name))
		.attr("x", _data.arranged(_name, "figure", _data.size_set, _data.size).x)
		.attr("y", _data.arranged(_name, "figure", _data.size_set, _data.size).y + (rect_size / 5) * 1.5)
		.attr("width", rect_size)
		.attr("height", rect_size);
	}

	var view = function(_data)  {
		var size = _data.size;

		var svg = d3.select("#" + _data.id)
		.append("svg")
		.attr("id", _data.id + "_svg")
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

		if(_data.chart === "comutation")	{
			interfaceAlteration(_data, legendGroup);
		}
		else if(_data.chart === "needleplot")		{
			interfaceNeedleplot(_data, legendGroup);
		}
		else if(_data.chart === "pcaplot")	{
			interfacePcaPlot(_data, legendGroup);
		}

		var text = legendGroup.append("text")
		.attr("class", "legend_text")
		.style("font-size", "12px")
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