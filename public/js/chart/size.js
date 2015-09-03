define("size", [], function()   {
	var makeDiv = function(_order)    {
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

	var definitionSize = function()  {
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

	return {
		definitionSize : definitionSize,
		mkdiv : makeDiv 
	};
});
