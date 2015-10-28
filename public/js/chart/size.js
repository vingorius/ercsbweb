define("size", [], function()   {
	var mkDiv = function(_order)    {
		var div = document.createElement("div");

		if(!_order)	{
			return div;
		}

		Object.keys(_order).map(function(_d)  {
			if(_d === "attribute")  { 
				setAttr(div, _order[_d]); 
			}
			else if(_d === "style") { 
				setCss(div, _order[_d]); 
			}
		});
		return div;
	}

	var setAttr = function(_div, _order)    {
		Object.keys(_order).map(function(_d) {
			_div.setAttribute(_d, _order[_d]);
		});
	}

	var setCss = function(_div, _order)   {
		Object.keys(_order).map(function(_d) {
			_div.style[_d] = _order[_d];
		});
	}

	var initSize = function()  {
		if(arguments.length < 1 || arguments.length < 5)    {
			return undefined;
		}

		var target = $("#" + arguments[0]);
		var width = target.width();
		var height = target.height();
		var result = {};

		result.width = width;
		result.height = height;
		result.rwidth = width - arguments[3] - arguments[4];
		result.rheight = height - arguments[1] - arguments[2];
		result.margin = { 
			top : arguments[1],
			bottom : arguments[2],
			left : arguments[3],
			right : arguments[4]
		};

		for(var key in arguments[5])	{
			result[key] = arguments[5][key];
		}
		return result;
	}

	var mkSvg = function(_target, _width, _height)	{
		return d3.select(_target).append("svg")
		.attr("class", _target.substring(1, _target.length))
		.attr("width", _width)
		.attr("height", _height)
		.append("g")
		.attr("transform", "translate(0, 0)");
	}

	var mkAxis = function(_svg, _class, _posx, _posy, _func)	{
		return _svg.append("g")
		.attr("class", _class)
		.attr("transform", "translate( " + _posx + ", " + _posy + ")")
		.call(_func);
	}

	var styleStroke = function(_obj, _color, _width, _ani)	{
		_obj = _ani ? _obj.transition().duration(_ani) : _obj;
		_obj
		.style("stroke", _color || "none")
		.style("stroke-width", _width || 0);
	}

	return {
		initSize : initSize,
		mkdiv : mkDiv ,
		mkSvg : mkSvg,
		mkAxis : mkAxis,
		styleStroke : styleStroke,
	};
});
