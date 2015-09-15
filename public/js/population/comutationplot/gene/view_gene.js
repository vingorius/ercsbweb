var GENE = "population/comutationplot/gene/";

define(GENE + "view_gene", ["utils", "size", GENE + "event_gene"], function(_utils, _size, _event)	{
	var view = function(_data)	{
		var size = _data.size;
		var svg = _size.mkSvg("#comutationplot_gene", size.width, size.height);

		var xAxis = d3.svg.axis()
		.scale(_data.x)
		.orient("bottom")
		.tickValues([0, (_data.max / 2), _data.max]);

		var yAxis = d3.svg.axis()
		.scale(_data.y)
		.orient("right");

		var xaxis = svg.append("g")
		.attr("class", "comutationplot_gene_xaxis")
		.attr("transform", "translate(0, " + (size.height - size.margin.bottom) + ")")
		.call(xAxis);

		var yaxis = svg.append("g")
		.attr("class", "comutationplot_gene_yaxis")
		.attr("transform", "translate(" + (size.width - size.margin.right) + ", 0)")
		.call(yAxis)

		xaxis.selectAll("text")
		.style("font-size", "8px").style("fill", "#626262");

		yaxis.selectAll("text")
		.style("font-size", "8px").style("fill", "#626262")
		.on("mouseover", _event.axisOver)
		.on("mouseout", function()	{
			_event.mouseout(this, "axis");
		});

		yaxis.selectAll("path, line")
		.style("fill", "none").style("stroke", "none");

		xaxis.selectAll("path, line")
		.style("fill", "none").style("stroke", "#BFBFBF").style("stroke-width", "1px").style("shape-rendering", "crispEdges");

		var bar_group = svg.selectAll(".comutationplot_gene_bargroup")
		.data(_data.data)
		.enter().append("g")
		.attr("class", "comutationplot_gene_bargroup") 
		.attr("transform", function(_d)	{
			return "translate(0, " + _data.y(_d.name) + ")";
		});

		var stacked_bar = bar_group.selectAll("rect")  
		.data(function(_d)  {
			return _d.types; 
		})
		.enter().append("rect")
		.attr("class", "comutationplot_gene_bars")
		.style("fill", function(_d) { 
			return _utils.colour(_utils.defMutName(_d.type)); 
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
		.attr("height", function(_d) { 
			return _data.y.rangeBand() / 1.1; 
		});
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
		.attr("class", "comutationplot_gene_sort_label")
		.attr("transform", "translate(" + size.margin.left + ", " + size.margin.top + ")")
		.append("text")
		.text("#sample count")
		.style("fill", "#626262").style("font-size", "11px").style("font-weight", "bold").style("font-style", "italic")
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