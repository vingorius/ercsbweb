var NEEDLE_NAVI = "analysis/needleplot/navigation/";

define(NEEDLE_NAVI + "view_needlenavigation", ["utils", "size", NEEDLE_NAVI + "event_needlenavigation"], function(_utils, _size, _event)	{
	var box = function(_svg, _size, _data)	{
		var size = _size || {};

		var box_g = _svg.insert("g", "g")
		.data([{ 
			x : 0, 
			y : 0, 
			width : size.rwidth, 
			height : size.height 
		}])
		.attr("class", "needleplot_navigation_viewarea")
		.style("fill", "#eaeaea")
		.attr("transform", "translate(0, 0)");

		var box = box_g.append("rect")
		.attr("class", "needleplot_navigation_selectedarea")
		.attr("x", function(_d) { 
			return _d.x + size.margin.left; 
		})
		.attr("y", function(_d) { 
			return _d.y; 
		})
		.attr("width", function(_d) { 
			return _d.width - size.margin.left; 
		})
		.attr("height", function(_d) { 
			return _d.height; 
		})
		.attr("cursor", "move");

		var right_border = box_g.append("rect")
		.attr("class", "needleplot_navigation_rightarea")
		.style("fill", "#dbdbdb").style("stroke", "#dbdbdb")
		.attr("x", function(_d)	{ 
			return size.rwidth; 
		})
		.attr("y", 0)
		.attr("width", size.margin.left)
		.attr("height", size.height)
		.attr("cursor", "ew-resize");

		var left_border = box_g.append("rect")
		.attr("class", "needleplot_navigation_leftarea")
		.style("fill", "#dbdbdb").style("stroke", "#dbdbdb")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", size.margin.left)
		.attr("height", size.height)
		.attr("cursor", "ew-resize");

		var e = _event({
			box : box,
			right : right_border,
			left : left_border,
			size : size, 
			data : _data
		});

		box
		.call(e.moving);
		right_border
		.call(e.resizing_r);
		left_border
		.call(e.resizing_l);
	}

	var view = function(_data)	{
		var size = _data.size;

		var svg = d3.select("#needleplot_navigation")
		.append("svg")
		.attr("class", "needleplot_navigation")
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var xAxis = d3.svg.axis()
		.scale(_data.x)
		.orient("bottom");

		var yAxis = d3.svg.axis()
		.scale(_data.y)
		.orient("left");   

		var bar_group = svg.selectAll(".needleplot_navigation_minibargroup")
		.data(_data.stacked)
		.enter().append("g")
		.attr("class", "needleplot_navigation_minibargroup") 
		.attr("transform", function(_d) { 
			return "translate(" + _data.x(_d.position) + ", " + -size.margin.top + ")"; 
		})

		var stacked_bar = bar_group.selectAll("rect")  
		.data(function(_d)  { 
			return _d.public_list; 
		})
		.enter().append("rect")
		.attr("class", "needleplot_navigation_minibar")
		.attr("x", 0)
		.attr("y", function(_d) { 
			return _data.y(_d.y + _d.count); 
		})
		.attr("width", 1)
		.attr("height", function(_d) { 
			return (size.height + size.margin.top) - _data.y(_d.count); 
		});

		box(svg, size, _data);
	}
	
	return {
		view : view
	}
});