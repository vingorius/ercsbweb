// 'use strict';
define("population/comutationplot/pq/view_pq", ["utils", "size", "population/comutationplot/pq/event_pq"], function(_utils, _size, _event)	{
	var view = function(_data)	{
		var size = _data.size;
		var svg = _size.mkSvg("#comutationplot_pq", size.width, size.height);
		var xAxis = _size.setAxis(_data.x, "bottom", { "tickValues" : [0, _data.max / 2, _data.max]});
		var xaxis = _size.mkAxis(svg, "comutationplot_pq_xaxis", 0, (size.height - size.margin.bottom), xAxis);

		xaxis.selectAll("text")
		.style({"font-size" : "8px", "fill" : "#626262"});

		xaxis.selectAll("path, line")
		.style({"fill" : "none", "stroke" : "#BFBFBF", "stroke-width" : "1px", "shape-rendering" : "crispEdges"});

		var bar_group = svg.selectAll(".comutationplot_pq_bargroup")
		.data(_data.data)
		.enter().append("g")
		.attr("class", "comutationplot_pq_bargroup") 
		.attr("transform", function(_d)	{
			return "translate(0, " + _data.y(_d.gene) + ")"
		})
		.selectAll("rect")  
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
		.attr({"x" : size.margin.left, "y" : 0})
		.attr("width", function(_d) { 
			return _data.x(_utils.calLog((_d.q || _d.p))) - size.margin.left; 
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
		.attr({"class" : "comutationplot_pq_sort_label", "cursor" : "pointer"})
		.attr("transform", "translate(" + size.margin.left + ", " + size.margin.top + ")")
		.append("text")
		.on({"mouseover" : _event.e_over, "mouseout" : _event.m_out, "click" : _event.sortByValue})
		.text(function(_d) {	
			return "#" + (_d.data[0].list[0].q ? "q" : "p") + " value";
		})
		.style({"fill" : "#626262", "font-size" : "11px", "font-weight" : "bold", "font-style" : "italic"});
	}
	
	return {
		view : view,
		titleView : titleView
	}
});