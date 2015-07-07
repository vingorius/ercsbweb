define("needleplotnavigation/view_needlenavigation", ["utils", "size", "needleplotnavigation/event_needlenavigation"], function(_utils, _size, _event)	{
	var box = function(_svg, _size, _data)	{
		var svg = _svg || null;
		var size = _size || {};
		var data = _data || [];

		var box_g = svg.insert("g", "g")
		.data([{ 
			x : size.margin.left, 
			y : 0, 
			width : size.rwidth - size.margin.left, 
			height : size.height 
		}])
		.attr("class", "needle_select_box")
		.attr("transform", "translate(0, 0)");

		var box = box_g.append("rect")
		.attr("class", "navi_box")
		.attr("x", function(_d) { return _d.x; })
		.attr("y", function(_d) { return _d.y; })
		.attr("width", function(_d) { return _d.width; })
		.attr("height", function(_d) { return _d.height; })
		.attr("cursor", "move");

		var right_border = box_g.append("rect")
		.attr("class", "navi_2_box_right")
		.attr("x", size.rwidth)
		.attr("y", 0)
		.attr("width", size.margin.left)
		.attr("height", size.height)
		.attr("cursor", "ew-resize")
		//.style("stroke", "#96281B");

		var left_border = box_g.append("rect")
		.attr("class", "navi_2_box_left")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", size.margin.left)
		.attr("height", size.height)
		.attr("cursor", "ew-resize")
		//.style("stroke", "#96281B");

		var e = _event({
			box : box,
			right : right_border,
			left : left_border,
			size : size, 
			data : data
		});

		box
		.call(e.moving);
		right_border
		.call(e.resizing_r);
		left_border
		.call(e.resizing_l);
	}

	var view = function(_data)	{
		var data = _data || {};
		var size = data.size;

		var svg = d3.select("#needleplot_navigation")
		.append("svg")
		.attr("class", "needleplot_navigation")
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var xAxis = d3.svg.axis()
		.scale(data.x)
		.orient("bottom");

		var yAxis = d3.svg.axis()
		.scale(data.y)
		.orient("left");   

		var bar_group = svg.selectAll(".navibar_2_group")
		.data(data.stacked)
		.enter().append("g")
		.attr("class", "navibar_2_group") 
		.attr("transform", function(_d) { return "translate(" + data.x(_d.position) + ", " + -size.margin.top + ")"; })

		var stacked_bar = bar_group.selectAll("rect")  
		.data(function(_d)  { return _d.sample_list; })
		.enter().append("rect")
		.attr("class", function(_d) { return "stacked_hbar_navi2"; })
		.attr("x", 0)
		.attr("y", function(_d) { return data.y(_d.y + _d.count); })
		.attr("width", 1)
		.attr("height", function(_d) { return (size.height + size.margin.top) - data.y(_d.count); });

		box(svg, size, data);
	}

	return {
		view : view
	}
});