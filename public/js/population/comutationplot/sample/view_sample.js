// 'use strict';
define("population/comutationplot/sample/view_sample", ["utils", "size", "population/comutationplot/sample/event_sample", "population/comutationplot/vo_comutationplot"], function(_utils, _size, _event, _VO)	{
	var view = function(_data)	{
		var size = _data.size;
		var svg = _size.mkSvg("#" + _data.class_name + "_sample", (_data.is_patient ? size.width : _VO.VO.getWidth()), size.height);

		var bar_group = svg.selectAll("." + _data.class_name + "_sample_bargroup")
		.data(_data.data)
		.enter().append("g")
		.attr("class", "" + _data.class_name + "_sample_bargroup") 
		.attr("transform", function(_d)	{
			_d.x = _data.x;
			_d.y = _data.y;

			return "translate(" + _data.x(_d.name) + ", 0)";
		})
		.selectAll("rect")  
		.data(function(_d)  {
			return _d.types; 
		})
		.enter().append("rect")
		.attr("class", _data.class_name + "_sample_bars")
		.attr("x", 0)
		.attr("y", function(_d) { 
			return _data.y(_d.start + _d.count); 
		})
		.attr("width", _data.x.rangeBand())
		.attr("height", function(_d) { 
			return (size.height - (size.margin.bottom / 2)) - _data.y(_d.count); 
		})
		.style("fill", function(_d) { 
			return _utils.mutate(_d.type).color;
		})
		.on("mouseover", _event.m_over)
		.on("mouseout", function(){ 
			_event.m_out(this, "bar");
		});
	}

	var titleView = function(_data)	{
		var size = _data.title_size;
		var svg = _size.mkSvg("#comutationplot_sample_yaxis_title", size.width, size.height);
		var yAxis = _size.setAxis(_data.y, "left", { "tickValues" : [0, _data.max / 2, _data.max]});
		var yaxis = _size.mkAxis(svg, "comutationplot_sample_yaxis", (size.width - size.margin.left / 2), 0, yAxis);

		yaxis.selectAll("text")
		.style({"fill" : "#626262", "font-size" : "8px"});

		yaxis.selectAll("path, line")
		.style({"fill" : "none", "stroke" : "#BFBFBF", "stroke-width" : "1px", "shape-rendering" : "crispEdges"});

		svg.append("g")
		.data([{ 
			data : _data.data, 
			size : size, 
			status : false 
		}])
		.attr({"class" : "comutationplot_sample_sort_label", "cursor" : "pointer"})
		.attr("transform", "translate(" + size.margin.left + ", " + (size.height - size.margin.left / 2) + ")")
		.append("text")
		.text("#mutation count")
		.style({"fill" : "#626262", "font-size" : "11px", "font-weight" : "bold", "font-style" : "italic"})
		.on("mouseover", _event.e_over)
		.on("mouseout", function()	{
			_event.m_out(this, "bar");
		})
		.on("click", _event.sortByValue);
	}
	
	return {
		view : view,
		titleView : titleView
	}
});