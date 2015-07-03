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
			var width = (div[0].offsetWidth / _width) * div[0].offsetWidth - (size.margin.left * 2);

			var udt_width = _utils.linearScale(0, data.data.data.graph[0].length,
				(size.margin.left * 2), (width - size.margin.left * 2)).clamp(true);
			var udt_x = _utils.linearScale(0, size.rwidth, (size.margin.left * 2), 
				(width - size.margin.left * 2)).clamp(true);

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
			var now_x = _x || 0, now_width = _width || size.rwidth;
			var update = update_size(now_x, now_width);
			var svg = update.svg;

			svg
			.attr("width", update.width);

			svg
			.select(".needle_gene_full_path_g rect")
			.attr("width", update.width - size.margin.left * 2);

			svg
			.selectAll(".graph_group")
			.attr("transform", function(_d) {
				if(_d.display) { return "translate(" + update.udt_width(_d.start) + ", " 
					+ (update.height - size.margin.left * 2) + ")"; }
				else { d3.select(this).remove(); }
			})
			.selectAll("rect")
			.attr("width", function(_d) { return update.udt_width(_d.end) - update.udt_width(_d.start); });

			svg.selectAll(".marker_group")
			.attr("transform", function(_d) {
				return "translate(" + update.udt_width(_d.position) + ", " 
					+ (update.height - size.margin.left * 2 - size.graph_width) + ")";
			});

			update.div
			.scrollLeft(update.udt_x(now_x));
		}

		var moving_event = function()   {
			var margin = size.margin.left * 2;

			elements.box.attr("x", function(_d) {
				return _d.x = Math.max(margin, 
					Math.min(size.rwidth - Number(elements.box.attr("width")), d3.event.x));
			});

			elements.right.attr("x", function(_d)    {
				return _d.x = Math.max(Number(elements.box.attr("width"))
					, Math.min(size.rwidth, d3.event.x + Number(elements.box.attr("width"))));
			});

			elements.left.attr("x", function(_d)    {
				return _d.x = Math.max(0, Math.min(elements.box.attr("x"), d3.event.x));
			});

			move_needle_plot(Number(elements.left.attr("x")), Number(elements.box.attr("width")));
		}

		var resizing_right_event = function() {

			elements.box.attr("width", function(_d)  {
				return _d.width = Math.max(0, Math.min(Number(elements.right.attr("x")), _d.width + d3.event.dx));
			});

			elements.right.attr("x", function(_d) {
				return Math.max(Number(elements.left.attr("x")) + Number(elements.left.attr("width"))
					, Math.min(size.rwidth, d3.event.dx + _d.x + Number(elements.box.attr("width"))));
			});

			scale_needle_plot(Number(elements.left.attr("x")), Number(elements.box.attr("width")));       
		}

		var resizing_left_event = function() {
			var margin = size.margin.left * 2;

			elements.box
			.attr("x", function(_d) {
				return _d.x = Math.max(Number(elements.left.attr("x")) + Number(elements.left.attr("width"))
					, Math.min(elements.right.attr("x"), d3.event.x));
			})
			.attr("width", function(_d) {
				return _d.width 
				= Number(elements.right.attr("x")) - Number(elements.left.attr("x"));
			});

			elements.left.attr("x", function(_d)    {
				return _d.x = Math.max(0, Math.min(Number(elements.right.attr("x")) - margin, d3.event.x));
			});

			scale_needle_plot(Number(elements.left.attr("x")), Number(elements.box.attr("width")));
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