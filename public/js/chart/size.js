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
		if(arguments.length < 1 || arguments.length !== 5)    {
			return undefined;
		}

		var target = $("#" + arguments[0]);
		var width = target.width();
		var height = target.height();

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

	var mkSvg = function(_target, _width, _height)	{
		var identifier = _target.substring(1, _target.length);

		return d3.select(_target).append("svg")
		.attr("id", identifier)
		.attr("class", identifier)
		.attr("width", _width)
		.attr("height", _height)
		.append("g")
		.attr("transform", "translate(0, 0)");
	}

	return {
		initSize : initSize,
		mkdiv : mkDiv ,
		mkSvg : mkSvg,
	};
});
