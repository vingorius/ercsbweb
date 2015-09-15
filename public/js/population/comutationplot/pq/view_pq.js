var PQ = "population/comutationplot/pq/";

define(PQ + "view_pq", ["utils", "size", PQ + "event_pq"], function(_utils, _size, _event)	{
	var view = function(_data)	{
		var size = _data.size;
		var svg = _size.mkSvg("#comutationplot_pq", size.width, size.height);

		var xAxis = d3.svg.axis()
		.scale(_data.x)
		.orient("bottom")
		.tickValues([0, _data.max / 2, _data.max]);

		var xaxis = svg.append("g")
		.attr("class", "comutationplot_pq_xaxis")
		.attr("transform", "translate(0, " + (size.height - size.margin.bottom) + ")")
		.call(xAxis);

		xaxis.selectAll("text")
		.style("font-size", "8px").style("fill", "#626262");

		xaxis.selectAll("path, line")
		.style("fill", "none").style("stroke", "#BFBFBF").style("stroke-width", "1px").style("shape-rendering", "crispEdges");

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
		.style("fill", "#BFBFBF")
		.on("mouseover", _event.m_over)
		.on("mouseout", function()	{
			_event.m_out(this, "bar");
		})
		.attr("x", function(_d) { 
			return size.margin.left; 
		})
		.attr("y", 0)
		.attr("width", function(_d) { 
			return _data.x(_utils.log((_d.q || _d.p))) - size.margin.left; 
		})
		.attr("height", _data.y.rangeBand() / 1.1);
	}

	var titleView = function(_data)	{
		var size = _data.title_size;
		var svg = _size.mkSvg("#comutationplot_pq_title", size.width, size.height);

		svg.append("g")
		.data([{ 
			data : _data.data, 
			size : _data.size, 
			status : false 
		}])
		.attr("class", "comutationplot_pq_sort_label")
		.attr("transform", "translate(" + size.margin.left + ", " + size.margin.top + ")")
		.append("text")
		.text(function(_d) {	
			return "#" + (_d.data[0].list[0].q ? "q" : "p") + " value";
		})
		.style("fill", "#626262").style("font-size", "11px").style("font-weight", "bold").style("font-style", "italic")
		.on("mouseover", _event.e_over)
		.on("mouseout", _event.m_out)
		.on("click", _event.sortByValue);
	}

	return {
		view : view,
		titleView : titleView
	}
});