define("size", [], function()   {
	var make_a_division = function(_order)    {
		var order = _order || {};
		var div = document.createElement("div");

		Object.keys(order).map(function(_d)  {
			if(_d === "attribute")  { 
				set_a_division_attr(div, order[_d]); 
			}
			else if(_d === "style") { 
				set_a_division_css(div, order[_d]); 
			}
		});
		return div;
	}

	var set_a_division_attr = function(_div, _order)    {
		var div = _div || null;
		var order = _order || {};

		Object.keys(order).map(function(_d) {
			div.setAttribute(_d, order[_d]);
		});
	}

	var set_a_division_css = function(_div, _order)   {
		var div = _div || null;
		var order = _order || {};

		Object.keys(order).map(function(_d) {
			div.style[_d] = order[_d];
		});
	}

	var define_size = function()  {
		if(arguments.length < 1 || arguments.length !== 5)    {
			return undefined;
		}

		var width = get_original_size(arguments[0]).width;
		var height = get_original_size(arguments[0]).height;

		return {
			width : width,
			height : height,
			rwidth : width - arguments[3] - arguments[4],
			rheight : height - arguments[1] - arguments[2],
			margin : {
				top : arguments[1],
				bottom : arguments[2],
				left : arguments[3],
				right : arguments[4]
			}            
		}
	}

	var get_original_size = function(_id)   {
		var layout = $("#" + _id);

		return {
			width : layout.width(),
			height : layout.height()
		}
	}

	return {
		define_size : define_size,
		get_original_size : get_original_size,
		mkdiv : make_a_division 
	};
});
