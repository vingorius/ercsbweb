var NEEDLE = "analysis/needleplot/needle/";

define(NEEDLE + "event_needleplot", ["utils", "size"], function(_utils, _size)    {
	var get_mouseover = function(_d)   {
		var contents = "";
		var target = $(this);
		target[0].parentNode.parentNode.parentNode.appendChild(target[0].parentNode.parentNode);
		var position = _utils.getPosition(target[0]);	

		switch(_d.target)	{
			case "marker" : contents = "<strong>type : <span style='color:red'>" + _d.type + "</span></br> value : <span style='color:red'>" + _d.count + "</span></br> position : <span style='color:red'>" + _d.position + "</span>"; break;
			case "graph" : contents = "<strong>text : <span style='color:red'>" + _d.text + "</span></br> section : <span style='color:red'>" + _d.start + " - " + _d.end + "</span>"; break;
			case "patient" : contents = "<strong>id : <span style='color:red'>" + _d.id + "</span></br> type : <span style='color:red'>" + _d.type + "</span></br> aachange : <span style='color:red'>" + _d.aachange + "</span></br> position : <span style='color:red'>" + _d.position + "</span>"; break;
		}

		d3.select(this).transition().duration(100).style("stroke-width", 2);
		_utils.tooltip(d3.event , contents, position.left, position.top + 50);
	}

	var get_mouseout = function(_d)    {
		d3.select(this).transition().duration(100).style("stroke-width", 0);
		_utils.tooltip();
	}

	var show_front_circle = function()  {
		var svg_g = $(".needleplot_view_needleplot g");
		var paths = d3.selectAll(".marker_figures_path");

		paths.forEach(function(_d, _i) {
			_d.sort(function(_a, _b)    {
				var a = d3.select(_a).datum();
				var b = d3.select(_b).datum();
				var result = (a.count + a.y < a.count + b.y) ? 1 : -1;
				return result;
			});
			append_parent(_d);
		});
	}

	var append_parent = function(_childs)    {
		_childs.forEach(function(_d)    {
			_d.parentNode.parentNode.parentNode.appendChild(_d.parentNode.parentNode)
		});
	}
	return {
		m_over : get_mouseover,
		m_out : get_mouseout,
		front : show_front_circle
	}
})