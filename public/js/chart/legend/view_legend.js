define("chart/legend/view_legend", ["utils", "size", "chart/legend/event_legend"], function(_utils, _size, _event)    {
	var setFigureData = function()	{
		this.set = {
			data : arguments[0],
			name : arguments[1],
		}
	}
	setFigureData.prototype.rect = function()	{
		this.set.x = arguments[0];
		this.set.y = arguments[1];
		this.set.width = arguments[2];
		this.set.height = arguments[3];
		return this;
	}
	setFigureData.prototype.circle = function()	{
		this.set.cx = arguments[0];
		this.set.cy = arguments[1];
		this.set.radius = arguments[2];
		return this;
	}
	setFigureData.prototype.style = function()	{
		this.set[arguments[0]] = arguments[1];
		return this;
	}

	var setFigure = function(_data, _g)	{
		var chart = _data.chart;

		for(var i = 0, len = _data.data.type_list.length ; i < len ; i++)	{
			var type = _data.data.type_list[i];
			var name = _utils.defMutName(type.name);
			var data_set = new setFigureData(_data, name);
			var arranged = _data.arranged(name, "figure", _data.size_set, _data.size);
			var info = null;

			switch(chart)	{
				case "comutation" : 
				if(type.alteration === "CNV")	{
					info = { id : "cnv", data : data_set.rect(0, 0, 4.5, 15).style("fill", _utils.colour(name)).set, type : "rect" };
				}
				else if(type.alteration === "mRNA Expression (log2FC)")	{
					info = { id : "exp", data : data_set.rect(0, 0, 4.5, 15).style("stroke", _utils.colour(name)).set, type : "rect" };
				}
				else {
					info = { id : "somatic", data : data_set.rect(0, 5, 4.5, 5).style("fill", _utils.colour(name)).set, type : "rect" }
				}; break;
				case "pcaplot" : 
				if(type.name === "Primary Solid Tumor")	{
					info = { id : "pcaplot", data : data_set.rect(0, 3, 10, 10).style("fill", _utils.colour(type.name)).set, type : "circle"};
				}
				else if(type.name === "Solid Tissue Normal")	{
					info = { id : "pcaplot", data : data_set.circle(5, 7.5, 5).style("fill", _utils.colour(type.name)).set, type : "rect"};
				}; break;
				case "needleplot" : 
				info = { id : "needleplot", data : data_set.circle(0, 8, 3).style("fill", _utils.colour(name)).set, type : "circle"}; break;
			}
			info.type === "circle" ? figureCircle(_g, info.id, info.data, arranged) : figureRect(_g, info.id, info.data, arranged);
		}
	}

	var figureCircle = function(_element, _id, _data, _arranged)	{
		return _element.append("circle")
		.attr("class", "legend_figure_" + _id)
		.attr("cx", _arranged.x + _data.cx)
		.attr("cy", _arranged.y + _data.cy)
		.attr("r", _data.radius)
		.style("fill", _data.fill ? _data.fill : "none")
		.style("stroke", _data.stroke ? _data.stroke : "none");
	}

	var figureRect = function(_element, _id, _data, _arranged)	{
		return _element.append("rect")
		.attr("class", "legend_figure_" + _id)
		.attr("x", _arranged.x + _data.x)
		.attr("y", _arranged.y + _data.y)
		.attr("width", _data.width)
		.attr("height", _data.height)
		.style("fill", _data.fill || "none")
		.style("stroke", _data.stroke || "none");
	}

	var view = function(_data)  {
		var size = _data.size;
		var svg = _size.mkSvg("#" + _data.id, size.width, size.height);

		var legendGroup = svg.selectAll(".legendGroup")
		.data(_data.data.type_list)
		.enter().append("g")
		.attr("class", "legendGroup")
		.attr("transform", "translate(" + size.margin.left + ", " + size.margin.top + ")");

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
		setFigure(_data, legendGroup);
	}
	return {
		view : view
	}
});