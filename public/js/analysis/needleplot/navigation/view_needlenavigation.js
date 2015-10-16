define("analysis/needleplot/navigation/view_needlenavigation", ["utils", "size", "analysis/needleplot/navigation/event_needlenavigation"], function(_utils, _size, _event)	{
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
		.attr("transform", "translate(0, 0)")
		.style("fill", "#eaeaea");

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

		var right_border = borderRect(box_g, "rightarea", size.rwidth, 0, size.margin.left, size.height);
		var left_border = borderRect(box_g, "leftarea", 0, 0, size.margin.left, size.height);
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

	var borderRect = function(_element, _class, _x, _y, _width, _height)		{
		return _element.append("rect")
		.attr("class", "needleplot_navigation_" + _class)
		.attr("x", _x)
		.attr("y", _y)
		.attr("width", _width)
		.attr("height", _height)
		.attr("cursor", "ew-resize")
		.style("fill", "#dbdbdb").style("stroke", "#dbdbdb");
	}

	var view = function(_data)	{
		var size = _data.size;
		var svg = _size.mkSvg("#needleplot_navigation", size.width, size.height);		

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