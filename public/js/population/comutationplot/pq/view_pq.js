var PQ = "population/comutationplot/pq/";

define(PQ + "view_pq", ["utils", "size", PQ + "event_pq"], function(_utils, _size, _event)	{
	var view = function(_data)	{
		var size = _data.size;

		var svg = d3.select("#comutationplot_pq")
		.append("svg")
		.attr("class", "comutationplot_pq")
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var xAxis = d3.svg.axis()
		.scale(_data.x)
		.orient("bottom")
		.tickValues([0, _data.max / 2, _data.max]);

		svg.append("g")
		.attr("class", "comutationplot_pq_xaxis")
		.attr("transform", "translate(0, " + (size.height - size.margin.bottom) + ")")
		.call(xAxis);

		var bar_group = svg.selectAll(".comutationplot_pq_bargroup")
		.data(_data.data)
		.enter().append("g")
		.attr("class", "comutationplot_pq_bargroup") 
		.attr("transform", function(_d)	{
			return "translate(0, " + _data.y(_d.gene) + ")"
		});

		var stacked_bar = bar_group.selectAll("rect")  
		.data(function(_d)  { 
			return _d.list; 
		})
		.enter().append("rect")
		.attr("class", "comutationplot_pq_bars")
		.on("mouseover", _event.m_over)
		.on("mouseout", function()	{
			_event.m_out(this, "bar");
		})
		.attr("x", function(_d) { 
			return size.margin.left; 
		})
		.attr("y", function(_d)	{
			return 0;
		})
		.attr("width", function(_d) { 
			return _data.x(_utils.log(_d.q)) - size.margin.left; 
		})
		.attr("height", _data.y.rangeBand() / 1.2);
	}

	var titleView = function(_data)	{
		var size = _data.title_size;

		var svg = d3.select("#comutationplot_pq_title")
		.append("svg")
		.attr("class", "comutationplot_pq_title")
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		svg.append("g")
		.data([{ 
			data : _data.data, 
			size : _data.size, 
			status : false 
		}])
		.attr("class", "pq_explain")
		.attr("transform", "translate(" + size.margin.left + ", " + size.margin.top + ")")
		.append("text")
		.text("#q value")
		.on("mouseover", _event.e_over)
		.on("mouseout", _event.m_out)
		.on("click", _event.sortByValue);
	}

	return {
		view : view,
		titleView : titleView
	}
});