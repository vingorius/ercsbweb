define("needleplotnavigation/event_needlenavigation", ["utils", "size"], function(_utils, _size)	{
	return function(_element) 	{
		var elements = _element || {};
		var size = elements.size;
		size.graph_width = 20;
		var data = elements.data;

		var move_needle_plot = function(_x, _width) {
			var now_x = _x || 0, now_width = _width || 0;
			var update = update_size(now_x, now_width);

			update.div
			.scrollLeft(update.udt_x(now_x));
		}		

		var update_size = function(_x, _width) {
			var svg = d3.select(".needleplot_view");
			var div = $("#needleplot_view");
			var height = div[0].offsetHeight;
			var width = (div[0].offsetWidth / _width) * div[0].offsetWidth - (size.margin.left);

			var udt_width = _utils.linearScale((size.margin.left), data.data.data.graph[0].length,
				(size.margin.left), (width - size.margin.left * 2)).clamp(true);
			var udt_x = _utils.linearScale(0, size.rwidth, (size.margin.left), 
				(width - size.margin.left)).clamp(true);

			return {
				svg : svg,
				div : div,
				width : width,
				height : height,
				udt_width : udt_width,
				udt_x : udt_x
			}
		}

		var scale_needle_plot = function(_x, _width)    {
			var box_x = _x || 0;
			var box_width = _width || 0;
			var update = update_size(box_x, box_width);
			var svg = update.svg;

			svg
			.attr("width", update.width);

			update.div
			.scrollLeft(box_x);
			/*

			var update_x_axis_scale = d3.svg.axis()
			.scale(update.udt_width)
			.orient("bottom");

			var update_x_axis = d3.select(".needle_x_axis")
			.call(update_x_axis_scale);

			var update_x_full_path = d3.select(".needle_gene_full_path_g")
			.attr("x", size.margin.left)
			.attr("width", update.width - size.margin.left);

			svg
			.selectAll(".graph_group")
			.attr("transform", function(_d) {
				if(_d.display) { 
					return "translate(" + update.udt_width(_d.start) + ", " 
					+ (update.height - size.margin.left) + ")"; 
				}
				else { d3.select(this).remove(); }
			})
			.selectAll("rect")
			.attr("width", function(_d) { return update.udt_width(_d.end) - update.udt_width(_d.start); });

			svg.selectAll(".marker_group")
			.attr("transform", function(_d) {
				return "translate(" + update.udt_width(_d.position) + ", "
					+ (update.height - size.margin.left - size.graph_width) + ")";
			});
			*/
		}

		var moving_event = function()   {
			var width = Number(elements.box.attr("width"));
			var x = Number(elements.box.attr("x"));
			var xr = Number(elements.right.attr("x"));
			var xl = Number(elements.left.attr("x"));
			var lw = Number(elements.left.attr("width"));
			var margin = size.margin.left;

			elements.box.attr("x", function(_d) {
				return Math.max(margin, 
					Math.min(xr - width + margin, d3.event.x + margin));
			});

			elements.right.attr("x", function(_d)    {
				return Math.max(width + margin, 
					Math.min(size.rwidth + margin, (d3.event.x + width + margin)));
			});

			elements.left.attr("x", function(_d)    {
				return _d.x = Math.max(0, Math.min(x, d3.event.x));
			});

			//move_needle_plot(elements.left.attr("x"), elements.box.attr("width"));
		}

		var resizing_right_event = function() {
			var lw = Number(elements.left.attr("width"));
			var width = Number(elements.box.attr("width"));
			var x = Number(elements.box.attr("x"));
			var xr = Number(elements.right.attr("x"));
			var xl = Number(elements.left.attr("x"));
			var lw = Number(elements.left.attr("width"));

			elements.right.attr("x", function(_d) {
				console.log(elements.right.attr("x"), elements.box.attr("x"), elements.box.attr("width"))
				return Math.max(elements.box.attr("x"), 
					Math.min(size.rwidth, size.rwidth + d3.event.x));
			});

			elements.box.attr("width", function(_d)  {
				return _d.width = Math.max(0, 
					Math.min(elements.right.attr("x") - size.margin.left, 
						size.rwidth + d3.event.x));
			});

			//scale_needle_plot(elements.box.attr("x"), elements.box.attr("width"));       
		}

		var resizing_left_event = function() {
			var xl = Number(elements.left.attr("x"));
			var lw = Number(elements.left.attr("width"));
			var xr = Number(elements.right.attr("x"));

			elements.left.attr("x", function(_d)    {
				return _d.x = Math.max(0, Math.min((xr - lw), d3.event.x));
			});

			elements.box
			.attr("width", function(_d) {
				return _d.width = (xr - xl) - size.margin.left;
			})
			.attr("x", function(_d) {
				return Math.max((xl + lw), Math.min(xr, d3.event.x));
			});

			//scale_needle_plot(elements.box.attr("x"), elements.box.attr("width"));
		}

		var box_drag_move = d3.behavior.drag()
		.origin(Object)
		.on("drag", moving_event);
		var box_drag_resize_right = d3.behavior.drag()
		.origin(Object)
		.on("drag", resizing_right_event);
		var box_drag_resize_left = d3.behavior.drag()
		.origin(Object)
		.on("drag", resizing_left_event);

		return {
			moving : box_drag_move,
			resizing_r : box_drag_resize_right,
			resizing_l : box_drag_resize_left
		}
	}
});