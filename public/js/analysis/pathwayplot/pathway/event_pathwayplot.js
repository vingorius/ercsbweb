var PATHWAY = "analysis/pathwayplot/pathway/"

define(PATHWAY + "event_pathwayplot", ["utils", "size"], function(_utils, _size)   {
	var twinklRect = function(_rect, _color, _width)	{
		_rect
		.transition().duration(500)
		// .style("stroke-dasharray", "25,90")
		.style("stroke", _color)
		.style("stroke-width", _width);
	}

	var mouseClick = function(_d)	{
		var script = document.createElement("script")
		script.src = "/js/analysis/pathwayplot/pathway/test.js";
		var head = document.querySelector("head");
		var is_js = document.querySelector("script[src*=test]");
		/* 
			클릭 할 때마다 불러오는건 무리가 있다. 
			View 가 호출이 완료 되기전에 한번 스크립트 태그를 불러오고, 그 후에 해당 파일안에 있는 
			함수를 이벤트 호출 때마다 사용하는편이 낫다.
		*/
		if(is_js === null)	{
			head.appendChild(script);
			// head.removeChild(script);
		}
		console.log(temp.test.test());
	}

	var mouseOver = function(_d)	{
		var e = d3.event;
		var parent = d3.select(this)[0][0].parentNode;
		var grand_parent = parent.parentNode;
		var rect = d3.select(parent).select("rect");
		var text = d3.select(parent).select("text");

		_utils.tooltip(
			rect[0][0],
			"<b>" + _d.name  
			+ "</b></br>frequency : "  + (_d.frequency === null ? "NA" : _d.frequency)
			+ "</br><span style='color:" + (_d.active === null ? "#E8E8E8" : _d.active === "Y" ? "red" : "blue") + "'><b>" 
			+ (_d.active === null ? "NA" : _d.active === "Y" ? "Activated" : "Inactivated") + "</b></span>", 
			"rgba(15, 15, 15, 0.6)"
		);

		insertRectData(_d, parent, grand_parent, rect, text);

		_utils.frontElement(parent, grand_parent);

		animateRect(rect, _d, true);
		animateText(text, _d, true);
	}

	var mouseOut = function(_d)	{
		var parent = d3.select(this)[0][0].parentNode;
		var parent_g = d3.select(parent);
			
		if(_d.width !== "")	{
			_utils.behindElement(parent, _d.child_index, parent.parentNode);
			_utils.tooltip();

			animateRect(parent_g.select("rect"), _d, false);
			animateText(parent_g.select("text"), _d, false);
		}
	}

	var insertRectData = function(_d, _parent, _grand_parent, _rect, _text)	{
		_d.x = _d.x === "" ? _rect.attr("x") : _d.x;
		_d.y = _d.y === "" ? _rect.attr("y") : _d.y;
		_d.width = _d.width === "" ? _rect.attr("width") : _d.width;
		_d.height = _d.height === "" ? _rect.attr("height") : _d.height;
		_d.font_size = _d.font_size === "" ? _text.style("font-size") : _d.font_size;
		_d.tx = _d.tx === "" ? _text.attr("x") : _d.tx;
		_d.ty = _d.ty === "" ? _text.attr("y") : _d.ty;
		_d.child_index = _d.child_index === 0 ? initElementIndex(_d, _grand_parent.childNodes, _parent) : _d.child_index;
	}

	var initElementIndex = function(_d, _all_child, _source)	{
		for(var i = 0, len = _all_child.length ; i < len ; i++)	{
			var child = $(_all_child[i])[0];

			if(child.id && (/gene_/i).test(child.id))	{
				if(_source.id === child.id)	{
					return i;
				}
			}
		}
	}

	var animateRect = function(_rect, _d, _is)	{
		_rect
		.transition().duration(200)
		.attr("x", (_is ? +_d.x - (_d.width / 10) : _d.x) + "px")
		.attr("y", (_is ? +_d.y - (_d.height / 10) : _d.y) + "px")
		.attr("width", (_is ? +_d.width + (_d.width / 5) : _d.width) + "px")
		.attr("height", (_is ? +_d.height + (_d.height / 5) : _d.height) + "px")
		.style("stroke-width", _is ? "2px" : "1px");
	}

	var animateText = function(_text, _d, _is)	{
		_text
		.transition().duration(150)
		.style("font-size", _is ? _utils.getNum(_d.font_size) * 1.25 + "px" : _d.font_size);
	}

	return 	{
		click : mouseClick,
		m_over : mouseOver,
		m_out : mouseOut,
		twinkl : twinklRect
	}
});