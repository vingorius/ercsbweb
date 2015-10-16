define("analysis/needleplot/navigation/event_needlenavigation", ["utils", "size"], function(_utils, _size)	{
	var tooltip = Object.create(_utils.tooltip);
	return function(_element) 	{
		var size = _element.size;
		var right_x = size.rwidth;

		var getDataLocation = function(_x, _width)	{
			var x = _utils.linearScale(size.margin.left, size.rwidth, 0, _element.data.data.data.graph[0].length).clamp(true);

			return {
				start : x(_x), 
				end : x(Number(_x) + Number(_width))
			}
		}

		var disappearItems = function(_position)	{
			var location = _position;

			if(_position === size.margin.left)	{
				location = -size.width;
			}
			else if(_position === size.rwidth)	{
				location = size.width * 2;	
			}
			return location;
		}

		var changeScale = function(_x, _width)    {
			var height = d3.select(".needleplot_view").attr("height");
			var loc_data = getDataLocation(_x, _width);
			var loc_x = _utils.linearScale(loc_data.start, loc_data.end, size.margin.left, size.rwidth).clamp(true);

			d3.select(".needleplot_xaxis")
			.call(d3.svg.axis().scale(loc_x).tickPadding(10))
			.selectAll("text")
			.style("font-size", "10px");

			var graph_group = d3.selectAll(".needleplot_graph_group")
			.attr("transform", function(_d)	{
				if(_d.display) { 
					return "translate(" + loc_x(_d.start) + ", " + (size.graph_width + (height - (size.margin.top * 2) - (size.margin.bottom * 2)))  + ")"; 
				}
				else { 
					d3.select(this).remove(); 
				}
			});
			var graph_rect = d3.selectAll(".needleplot_graph_group rect")
			.attr("width", function(_d) { 
				return loc_x(_d.end) - loc_x(_d.start); 
			});
			var graph_text = d3.selectAll(".needleplot_graph_intext")
			.attr("x", function(_d)	{
				return loc_x(_d.start) !== 20 ? 3 : disappearItems(loc_x(_d.start));
			});
			var maker_group = d3.selectAll(".needleplot_marker_group")
			.attr("transform", function(_d)	{
				var location = disappearItems(loc_x(_d.position));

				return "translate(" + location + ", " + (height - (size.margin.top * 2) - (size.margin.bottom * 2)) + ")";
			});
			var patient_group = d3.selectAll(".needleplot_patient_group")
			.attr("transform", function(_d) {
				var location = disappearItems(loc_x(_d.position));

				return "translate( " + location+ ", " + (height - ((size.margin.top* 2) * 1.7))+ " )";
			});
		}

		var eventMoving = function()   {
			var width = Number(_element.box.attr("width"));
			var x = Number(_element.box.attr("x"));
			var xr = Number(_element.right.attr("x"));
			var xl = Number(_element.left.attr("x"));
			var lw = Number(_element.left.attr("width"));

			_element.box.attr("x", function(_d) {
				return Math.max(xl + lw, Math.min(xr - width, d3.event.x));
			})
			.on("mouseup", function(_d)	{ 
				right_x = +xr;
			});

			_element.right.attr("x", function(_d)    {
				return Math.max((xl + lw) + width, Math.min(size.rwidth, (d3.event.x + width)));
			});

			_element.left.attr("x", function(_d)    {
				return _d.x = Math.max(0, Math.min(x - size.margin.left, d3.event.x));
			});
			changeScale(_element.box.attr("x"), _element.box.attr("width"));
		}

		var resizeEventToRight = function() {
			var x = Number(_element.box.attr("x"));
			var xr = Number(_element.right.attr("x"));
			var xl = Number(_element.left.attr("x"));
			var now_x = 0;

			_element.right.attr("x", function(_d) {
				if((right_x + d3.event.x) - xl >= size.rwidth)	{
					now_x = size.rwidth;
					right_x = size.rwidth;
				}
				else { 
					now_x = (right_x + d3.event.x) - xl; 
				}
				return Math.max(_element.box.attr("x"), Math.min(size.rwidth, now_x));
			})
			.on("mouseup", function(_d) { 
				right_x = now_x;
			});

			_element.box.attr("width", function(_d)  {
				return _d.width = Math.max(0, Math.min(xr - x, size.rwidth + d3.event.x));
			});
			changeScale(_element.box.attr("x"), _element.box.attr("width"));
		}

		var resizeEventToLeft = function() {
			var xl = Number(_element.left.attr("x"));															
			var lw = Number(_element.left.attr("width"));														
			var xr = Number(_element.right.attr("x"));															
																												
			_element.left.attr("x", function(_d)    {																
				if(xl === 0)	{ 																					
					xl = 0; 																						
				}
				return _d.x = Math.max(0, Math.min((xr - lw), d3.event.x));										
			})
			.on("mouseup", function(_d) { 		
				right_x = +right_x;																
			});

			_element.box 																						
			.attr("width", function(_d) { 																			
				return _d.width = (xr - xl) - size.margin.left; 
			})
			.attr("x", function(_d) { 												
				return Math.max((xl + lw), Math.min(xr, d3.event.x)); 
			});
			changeScale(_element.box.attr("x"), _element.box.attr("width"));
		}

		var dragMove = d3.behavior.drag()					 
		.origin(Object)												
		.on("drag", eventMoving);									
		var dragRight = d3.behavior.drag()			
		.origin(Object)
		.on("drag", resizeEventToRight);
		var dragLeft = d3.behavior.drag()
		.origin(Object)
		.on("drag", resizeEventToLeft);

		return {
			moving : dragMove,
			resizing_r : dragRight,
			resizing_l : dragLeft,
		}
	}
});