define("chart/legend/view_legend", ["utils", "size"], function(_utils, _size)    {
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
		.attr("x", _data.arranged(_name, "figure", _data.size_set, _data.size).x)
		.attr("y", _data.arranged(_name, "figure", _data.size_set, _data.size).y)
		.attr("width", width)
		.attr("height", height)
		.style("fill", _utils.colour(_utils.definitionMutationName(_name)));
	}

	var figureOfExp = function(_data, _g, _name)	{
		var width = 4.5;
		var height = 15;

		return _g.append("rect")
		.attr("class", "legend_figure_exp")
		.attr("x", _data.arranged(_name, "figure", _data.size_set, _data.size).x)
		.attr("y", _data.arranged(_name, "figure", _data.size_set, _data.size).y)
		.attr("width", width)
		.attr("height", height)
		.style("stroke", _utils.colour(_utils.definitionMutationName(_name)));
	}

	var figureOfSomatic = function(_data, _g, _name)	{
		var width = 4.5;
		var height = 15;

		return _g.append("rect")
		.attr("class", "legend_figure_somatic")
		.attr("x", _data.arranged(_name, "figure", _data.size_set, _data.size).x)
		.attr("y", (_data.arranged(_name, "figure", _data.size_set, _data.size).y + height) - 10)
		.attr("width", width)
		.attr("height", height / 3)
		.style("fill", _utils.colour(_utils.definitionMutationName(_name)));
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
		.attr("cx", _data.arranged(_name, "figure", _data.size_set, _data.size).x)
		.attr("cy", (_data.arranged(_name, "figure", _data.size_set, _data.size).y + radius) - 7)
		.attr("r", radius / 5)
		.style("fill", _utils.colour(_utils.definitionMutationName(_name)));
	}
	
	var interfacePcaPlot = function(_data, _g)	{
		for(var i = 0, len = _data.data.type_list.length ; i < len ; i++)	{
			var type = _data.data.type_list[i];
			var figure = makeFigureName(_data, _g, type.name);
		}
	}

	var makeFigureName = function(_data, _g, _name)	{
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
		.attr("cx", _data.arranged(_name, "figure", _data.size_set, _data.size).x + radius)
		.attr("cy", _data.arranged(_name, "figure", _data.size_set, _data.size).y + radius * 1.5)
		.attr("r", radius)
		.style("fill", _utils.colour(_name));
	}

	var figureOfPcaplot2 = function(_data, _g, _name)	{
		var rect_size = 10;

		return _g.append("rect")
		.attr("class", "legend_figure_pcaplot")
		.attr("x", _data.arranged(_name, "figure", _data.size_set, _data.size).x)
		.attr("y", _data.arranged(_name, "figure", _data.size_set, _data.size).y + (rect_size / 5) * 1.5)
		.attr("width", rect_size)
		.attr("height", rect_size)
		.style("fill", _utils.colour(_name));
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