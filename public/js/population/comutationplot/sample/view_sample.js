var SAMPLE = "population/comutationplot/sample/";

define(SAMPLE + "view_sample", ["utils", "size", SAMPLE + "event_sample"], function(_utils, _size, _event)	{
	var view = function(_data)	{
		var data = _data || {};
		var size = data.size;
		var e = _event || null;

		var svg = d3.select("#comutationplot_sample")
		.append("svg")
		.attr("class", "comutationplot_sample")
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var yAxis = d3.svg.axis()
		.scale(data.y)
		.orient("left")
		.tickValues([0, data.max / 2, data.max]);

		svg.append("g")
		.attr("class", "comutationplot_sample_yaxis")
		.attr("transform", "translate(" + size.margin.left + ", 0)")
		.call(yAxis);

		svg.append("g")
		.data([{ data : data.data, size : size, status : false }])
		.attr("class", "sample_explain")
		.attr("transform", "translate(" + (size.margin.left * 1.5) + ", " + (size.margin.top * 1.5) + ")")
		.append("text")
		.text("#samples count")
		.on("click", e.sort_by_value);

		$(".sample_explain")
		.tooltip({
			container : "body",
			title : "sort by sample value",
			placement : "top"
		});

		var bar_group = svg.selectAll(".comutationplot_sample_bargroup")
		.data(data.data)
		.enter().append("g")
		.attr("class", "comutationplot_sample_bargroup") 
		.attr("transform", function(_d)	{
			return "translate(" + data.x(_d.sample) + ", 0)";
		});

		var stacked_bar = bar_group.selectAll("rect")  
		.data(function(_d)  {
			return _d.types; 
		})
		.enter().append("rect")
		.attr("class", "comutationplot_sample_bars")
		.attr("x", function(_d) { 
			return data.x(_d.sample); 
		})
		.attr("y", function(_d) { 
			return data.y(_d.start + _d.count); 
		})
		.attr("width", data.x.rangeBand())
		.attr("height", function(_d) { 
			return (size.height - size.margin.bottom) - data.y(_d.count); 
		})
		.style("fill", function(_d) { 
			return _utils.colour(_utils.define_mutation_name(_d.type)); 
		})
		.on("mouseover", e.m_over)
		.on("mouseout", e.m_out);
	}

	return {
		view : view
	}
});