var NEEDLE_NAVI = "needleplot/navigation/";

define(NEEDLE_NAVI + "event_needlenavigation", ["utils", "size"], function(_utils, _size)	{
	return function(_element) 	{
		var elements = _element || {};
		var size = elements.size;
		size.graph_width = 20;
		var data = elements.data;
		var right_x = size.rwidth;

		var get_data_location = function(_x, _width)	{
			var x = _utils.linearScale(size.margin.left, size.rwidth, 
				0, data.data.data.graph[0].length).clamp(true);

			return {
				x : x, start : x(_x), end : x(Number(_x) + Number(_width))
			}
		}

		var disappear_item = function(_position)	{
			var location = _position;

			if(_position === size.margin.left)	{
				location = -size.width;
			}
			else if(_position === size.rwidth)	{
				location = size.width * 2;	
			}
			return location;
		}

		var scale_needle_plot = function(_x, _width)    {
			var svg = d3.select(".needleplot_view");
			var width = svg.attr("width");
			var height = svg.attr("height");
			var loc_data = get_data_location(_x, _width);
			var loc_x = _utils.linearScale(loc_data.start, loc_data.end, 
				size.margin.left, size.rwidth).clamp(true);

			var xaxis = d3.select(".needle_x_axis")
			.call(d3.svg.axis().scale(loc_x).orient("bottom"));

			var graph_group = d3.selectAll(".graph_group")
			.attr("transform", function(_d)	{
				if(_d.display) { 
					return "translate(" + loc_x(_d.start) + ", "
					+ (size.graph_width 
					+ (height - (size.margin.top * 2) - (size.margin.bottom * 2))) 
					+ ")"; }
				else { d3.select(this).remove(); }
			});

			var graphs = d3.selectAll(".graph_group rect")
			.attr("width", function(_d) { return loc_x(_d.end) - loc_x(_d.start); });

			var text_group = d3.selectAll(".text_group")
			.attr("transform", function(_d)	{
				var location = disappear_item(loc_x(_d.start));
				if(_d.display) { 
					return "translate(" + location + ", "
					+ (size.graph_width 
					+ (height - (size.margin.top * 2) - (size.margin.bottom * 2))) 
					+ ")"; }
				else { d3.select(this).remove(); }
			});

			var maker_group = d3.selectAll(".marker_group")
			.attr("transform", function(_d)	{
				var location = disappear_item(loc_x(_d.position));
				return "translate(" + location + ", " + (height - (size.margin.top * 2) - (size.margin.bottom * 2)) + ")";
			});
		}

		var moving_event = function()   {
			var width = Number(elements.box.attr("width"));
			var x = Number(elements.box.attr("x"));
			var xr = Number(elements.right.attr("x"));
			var xl = Number(elements.left.attr("x"));
			var lw = Number(elements.left.attr("width"));

			elements.box.attr("x", function(_d) {
				return Math.max(xl + lw, Math.min(xr - width, d3.event.x));
			})
			.on("mouseup", function(_d)	{ moving_end(_d, xr - xl); });

			elements.right.attr("x", function(_d)    {
				return Math.max((xl + lw) + width, 
					Math.min(size.rwidth, (d3.event.x + width)));
			});

			elements.left.attr("x", function(_d)    {
				return _d.x = Math.max(0, Math.min(x - size.margin.left, d3.event.x));
			});
			scale_needle_plot(elements.box.attr("x"), elements.box.attr("width"));
		}

		var moving_end = function(_d, _now)	{
			right_x = Number(_now);
		}

		var resizing_right_event = function() {
			var x = Number(elements.box.attr("x"));
			var xr = Number(elements.right.attr("x"));
			var xl = Number(elements.left.attr("x"));
			var now_x = 0;

			elements.right.attr("x", function(_d) {
				if(xl === 0)	{ xl == 0; }
				if(xr === size.rwidth)	{ right_x == xr; }
				if((right_x + d3.event.x) - xl >= size.rwidth)	{
					right_x = size.rwidth;
				}
				else { now_x = (right_x + d3.event.x) - xl; }

				return Math.max(elements.box.attr("x"), 
					Math.min(size.rwidth, right_x + (d3.event.x)));
			})
			.on("mouseup", function(_d) { resizing_right_end(_d, now_x, xl); });

			elements.box.attr("width", function(_d)  {
				return _d.width = Math.max(size.margin.left, 
					Math.min(xr - x, size.rwidth + d3.event.x));
			});
			scale_needle_plot(elements.box.attr("x"), elements.box.attr("width"));       
		}

		var resizing_right_end = function(_d, _now, _xl)	{
			right_x = _now;
		}

		var resizing_left_event = function() {
			var xl = Number(elements.left.attr("x"));
			var lw = Number(elements.left.attr("width"));
			var xr = Number(elements.right.attr("x"));

			elements.left.attr("x", function(_d)    {
				if(xl === 0)	{ xl = 0; }
				return _d.x = Math.max(0, Math.min((xr - lw), d3.event.x));
			})
			.on("mouseup", function(_d) { moving_end(_d, xr - xl); });

			elements.box
			.attr("width", function(_d) { return _d.width = (xr - xl) - size.margin.left; })
			.attr("x", function(_d) { return Math.max((xl + lw), Math.min(xr, d3.event.x)); });
			scale_needle_plot(elements.box.attr("x"), elements.box.attr("width"));
		}

		var box_drag_move = d3.behavior.drag()
		.origin(Object).on("drag", moving_event);
		var box_drag_resize_right = d3.behavior.drag()
		.origin(Object).on("drag", resizing_right_event);
		var box_drag_resize_left = d3.behavior.drag()
		.origin(Object).on("drag", resizing_left_event);

		return {
			moving : box_drag_move,
			resizing_r : box_drag_resize_right,
			resizing_l : box_drag_resize_left
		}
	}
});