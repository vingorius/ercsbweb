// 'use strict';
define("population/comutationplot/gene/view_gene", ["utils", "size", "population/comutationplot/gene/event_gene"], function(_utils, _size, _event)	{
	var view = function(_data)	{
		var size = _data.size;
		var svg = _size.mkSvg("#comutationplot_gene", size.width, size.height);
		var xAxis = _size.setAxis(_data.x, "bottom", { "tickValues" : [0, _data.max / 2, _data.max]});
		var yAxis = _size.setAxis(_data.y, "right");
		var xaxis = _size.mkAxis(svg, "comutationplot_gene_xaxis", 0, (size.height - size.margin.bottom), xAxis);
		var yaxis = _size.mkAxis(svg, "comutationplot_gene_yaxis", (size.width - size.margin.right), 0, yAxis);

		xaxis.selectAll("text")
		.style({"font-size" : "8px", "fill" : "#626262"});

		yaxis.selectAll("text")
		.style({"font-size" : "8px", "fill" : "#626262"})
		.on("mouseover", _event.axisOver)
		.on("mouseout", function()	{
			_event.mouseout(this, "axis");
		});

		yaxis.selectAll("path, line")
		.style({"fill" : "none", "stroke" : "none"});

		xaxis.selectAll("path, line")
		.style({"fill" : "none", "stroke" : "#BFBFBF", "stroke-width" : "1px", "shape-rendering" : "crispEdges"});

		var bar_group = svg.selectAll(".comutationplot_gene_bargroup")
		.data(_data.data)
		.enter().append("g")
		.attr("class", "comutationplot_gene_bargroup") 
		.attr("transform", function(_d)	{
			return "translate(0, " + _data.y(_d.name) + ")";
		})
		.selectAll("rect")  
		.data(function(_d)  {
			return _d.types; 
		})
		.enter().append("rect")
		.attr("class", "comutationplot_gene_bars")
		.style("fill", function(_d) { 
			if(_utils.mutate(_d.type))	{
				return _utils.mutate(_d.type).color;
			}
		})
		.on("mouseover", _event.barOver)
		.on("mouseout", function()	{
			_event.mouseout(this, "bar");
		})
		.attr("x", function(_d) { 
			return _data.x(_d.start + _d.count); 
		})
		.attr("y", 0)
		.attr("width", function(_d) { 
			return ((size.width - size.margin.right) - _data.x(_d.count)); 
		})
		.attr("height", (_data.y.rangeBand() / 1.1));
	}

	var titleView = function(_data)	{
		var size = _data.title_size;
		var svg = _size.mkSvg("#comutationplot_gene_title", size.width, size.height);

		svg.append("g")
		.data([{ 
			data : _data.data, 
			size : _data.size, 
			status : false 
		}])
		.attr({"class" : "comutationplot_gene_sort_label", "cursor" : "pointer"})
		.attr("transform", "translate(" + size.margin.left + ", " + size.margin.top + ")")
		.append("text")
		.text("#sample count")
		.style({"fill" : "#626262", "font-size" : "11px", "font-weight" : "bold", "font-style" : "italic"})
		.on("mouseover", _event.explainOver)
		.on("mouseout", function()	{
			_event.mouseout(this, "explain");
		})
		.on("click", _event.sortByValue);
	}

	return {
		view : view,
		titleView : titleView
	}
});