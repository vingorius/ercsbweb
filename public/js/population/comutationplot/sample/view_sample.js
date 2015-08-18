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

		var bar_group = svg.selectAll(".comutationplot_sample_bargroup")
		.data(data.data)
		.enter().append("g")
		.attr("class", "comutationplot_sample_bargroup") 
		.attr("transform", function(_d)	{
			_d.x = data.x;
			_d.y = data.y;
			return "translate(" + data.x(_d.sample) + ", 0)";
		});

		var stacked_bar = bar_group.selectAll("rect")  
		.data(function(_d)  {
			return _d.types; 
		})
		.enter().append("rect")
		.attr("class", "comutationplot_sample_bars")
		.attr("x", 0)
		.attr("y", function(_d) { 
			return data.y(_d.start + _d.count); 
		})
		.attr("width", data.x.rangeBand())
		.attr("height", function(_d) { 
			return (size.height - (size.margin.bottom / 2)) - data.y(_d.count); 
		})
		.style("fill", function(_d) { 
			return _utils.colour(_utils.define_mutation_name(_d.type)); 
		})
		.on("mouseover", e.m_over)
		.on("mouseout", e.m_out);
	}

	var titleView = function(_data)	{
		var size = _data.title_size;
		var e = _event || null;

		var svg = d3.select("#comutationplot_sample_yaxis_title")
		.append("svg")
		.attr("class", "comutationplot_sample_yaxis_title")
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var yAxis = d3.svg.axis()
		.scale(_data.y)
		.orient("left")
		.tickValues([0, _data.max / 2, _data.max]);

		svg.append("g")
		.attr("class", "comutationplot_sample_yaxis")
		.attr("transform", "translate(" + (size.width - (size.margin.left / 2)) + ", 0)")
		.call(yAxis);

		svg.append("g")
		.data([{ data : _data.data, size : size, status : false }])
		.attr("class", "sample_explain")
		.attr("transform", "translate(" + size.margin.left + ", " + (size.height - size.margin.left / 2) + ")")
		.append("text")
		.text("#samples count")
		.on("click", e.sort_by_value);

		$(".sample_explain")
		.tooltip({
			container : "body",
			title : "sort by sample value",
			placement : "top"
		});
	}

	return {
		view : view,
		titleView : titleView
	}
});