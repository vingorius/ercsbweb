var GENE = "comutationplot/gene/";

define(GENE + "view_gene", ["utils", "size", GENE + "event_gene"], function(_utils, _size, _event)	{
	var view = function(_data)	{
		var data = _data || {};
		var size = data.size;
		var e = _event || null;

		var svg = d3.select("#comutationplot_gene")
		.append("svg")
		.attr("class", "comutationplot_gene")
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var xAxis = d3.svg.axis()
		.scale(data.x)
		.orient("bottom")
		.tickValues([0, data.max / 2, data.max]);

		var yAxis = d3.svg.axis()
		.scale(data.y)
		.orient("right");

		svg.append("g")
		.attr("class", "comutationplot_gene_xaxis")
		.attr("transform", "translate(0, " + (size.height - size.margin.top) + ")")
		.call(xAxis);

		svg.append("g")
		.attr("class", "comutationplot_gene_yaxis")
		.attr("transform", "translate(" + (size.width - size.margin.right) + ", 0)")
		.call(yAxis)
		.selectAll("text")
		.on("mouseover", e.axis_m_over)
		.on("mouseout", e.axis_m_out);

		svg.append("g")
		.data([{ 
			data : data.data, 
			size : size, 
			status : false 
		}])
		.attr("class", "gene_explain")
		.attr("transform", "translate(" + (size.rwidth + size.margin.left * 1.5) + ", " + (size.height - 2) + ")")
		.append("text")
		.text("#mutations")
		.on("click", e.sort_by_value);

		$(".gene_explain")
		.tooltip({
			container : "body",
			title : "sort by mutation value",
			placement : "bottom"
		});

		var bar_group = svg.selectAll(".comutationplot_gene_bargroup")
		.data(data.data)
		.enter().append("g")
		.attr("class", "comutationplot_gene_bargroup") 
		.attr("transform", "translate(0, 0)");

		var stacked_bar = bar_group.selectAll("rect")  
		.data(function(_d)  { 
			return _d.list; 
		})
		.enter().append("rect")
		.attr("class", "comutationplot_gene_bars")
		.style("fill", function(_d) { 
			return _utils.colour(_d.type); 
		})
		.on("mouseover", e.bar_m_over)
		.on("mouseout",e.bar_m_out)
		.attr("x", function(_d) { 
			_d.x = data.x; 
			return _d.x(_d.start + _d.count); 
		})
		.attr("y", function(_d) { 
			_d.y = data.y; 
			return _d.y(_d.gene); 
		})
		.attr("width", function(_d) { 
			return ((size.width - size.margin.right) - _d.x(_d.count)); 
		})
		.attr("height", function(_d) { 
			return _d.y.rangeBand() / 1.2; 
		});
	}
	return {
		view : view
	}
});