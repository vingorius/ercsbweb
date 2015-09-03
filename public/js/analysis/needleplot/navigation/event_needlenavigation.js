var NEEDLE_NAVI = "analysis/needleplot/navigation/";

define(NEEDLE_NAVI + "event_needlenavigation", ["utils", "size"], function(_utils, _size)	{
	return function(_element) 	{
		var size = _element.size;
		size.graph_width = 20;
		var data = _element.data.data.data;
		var right_x = size.rwidth;

		var getDataLocation = function(_x, _width)	{
			var x = _utils.linearScale(size.margin.left, size.rwidth, 0, data.graph[0].length)
			.clamp(true);

			return {
				x : x, 
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

		var changeScale = function(_target, _event, _x, _width)    {
			var svg = d3.select(".needleplot_view");
			var width = svg.attr("width");
			var height = svg.attr("height");
			var loc_data = getDataLocation(_x, _width);
			var loc_x = _utils.linearScale(loc_data.start, loc_data.end, size.margin.left, size.rwidth).clamp(true);

			var graph_group = d3.selectAll(".graph_group")
			.attr("transform", function(_d)	{
				if(_d.display) { 
					return "translate(" + loc_x(_d.start) + ", "
					+ (size.graph_width + (height - (size.margin.top * 2) - (size.margin.bottom * 2))) 
					+ ")"; 
				}
				else { 
					d3.select(this).remove(); 
				}
			});

			var graphs = d3.selectAll(".graph_group rect")
			.attr("width", function(_d) { 
				return loc_x(_d.end) - loc_x(_d.start); 
			});

			var text_group = d3.selectAll(".text_group")
			.attr("transform", function(_d)	{
				var location = disappearItems(loc_x(_d.start));

				if(_d.display) { 
					return "translate(" + location + ", "
					+ (size.graph_width + (height - (size.margin.top * 2) - (size.margin.bottom * 2))) 
					+ ")"; 
				}
				else { 
					d3.select(this).remove(); 
				}
			});

			var maker_group = d3.selectAll(".marker_group")
			.attr("transform", function(_d)	{
				var location = disappearItems(loc_x(_d.position));

				return "translate(" + location + ", " + (height - (size.margin.top * 2) - (size.margin.bottom * 2)) + ")";
			});

			var patient_group = d3.selectAll(".patient_group")
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
				endToMoving((xr - xl)); 
				_utils.tooltip();
			});

			_element.right.attr("x", function(_d)    {
				return Math.max((xl + lw) + width, Math.min(size.rwidth, (d3.event.x + width)));
			});

			_element.left.attr("x", function(_d)    {
				return _d.x = Math.max(0, Math.min(x - size.margin.left, d3.event.x));
			});
			changeScale($(this), d3.event, _element.box.attr("x"), _element.box.attr("width"));
		}

		var endToMoving = function(_now)	{
			right_x = Number(_now);
		}

		var resizeEventToRight = function() {
			var x = Number(_element.box.attr("x"));
			var xr = Number(_element.right.attr("x"));
			var xl = Number(_element.left.attr("x"));
			var now_x = 0;

			_element.right.attr("x", function(_d) {
				if(xl === 0)	{ 
					xl = 0; 
				}
				if(xr === size.rwidth)	{ 
					right_x = xr; 
				}
				if((right_x + d3.event.x) - xl >= size.rwidth)	{
					right_x = size.rwidth;
				}
				else { 
					now_x = (right_x + d3.event.x) - xl; 
				}
				return Math.max(_element.box.attr("x"), Math.min(size.rwidth, right_x + (d3.event.x)));
			})
			.on("mouseup", function(_d) { 
				resizingEndToRight(_d, now_x, xl); 
				_utils.tooltip();
			});

			_element.box.attr("width", function(_d)  {
				return _d.width = Math.max(0, Math.min(xr - x, size.rwidth + d3.event.x));
			});
			changeScale($(this), d3.event, _element.box.attr("x"), _element.box.attr("width"));       
		}

		var resizingEndToRight = function(_d, _now, _xl)	{
			right_x = _now;																						
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
				if(xl === 0)	{																					
					endToMoving(_d, right_x);																	
				}																								
				else {
					endToMoving(_d, xr - xl); 																	
				}
				_utils.tooltip();																					
			});

			_element.box 																						
			.attr("width", function(_d) { 																			
				return _d.width = (xr - xl) - size.margin.left; 
			})
			.attr("x", function(_d) { 																				
				return Math.max((xl + lw), Math.min(xr, d3.event.x)); 
			});
			changeScale($(this), d3.event, _element.box.attr("x"), _element.box.attr("width"));			
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