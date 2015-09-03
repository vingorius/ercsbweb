var NEEDLE = "analysis/needleplot/needle/";

define(NEEDLE + "event_needleplot", ["utils", "size"], function(_utils, _size)    {
	var eventMouseover = function(_d)   {
		var contents = "";
		var e = d3.event;
		var target = d3.select(this);
		var group = target[0][0].parentNode.parentNode;
		var source = group.parentNode;
		_d.child_index = _d.child_index ? _d.child_index : getNowElementIndexOfChild(group, source.childNodes);

		switch(_d.target)	{
			case "marker" : 
				contents = "<b>" + _d.type + "</b></br> value : " + _d.count + "</br> position : " + _d.position; 
				break;
			case "graph" : 
				contents = "<b>" + _d.text + "</b></br> section : " + _d.start + " - " + _d.end; 
				break;
			case "patient" : 
				contents = "<b>" + _d.id + "</b></br> type : " + _d.type + "</br> aachange : " + _d.aachange + "</br> position : " + _d.position; 
				break;
		}

		_utils.frontElement(group, source);
		_utils.tooltip(this, contents, "rgba(15, 15, 15, 0.6)");
		
		target
		.transition().duration(200)
		.style("stroke", function(_d)	{
			return d3.rgb(_d.colour || _utils.colour(_utils.definitionMutationName(_d.type))).darker(2);
		})
		.style("stroke-width", "2px");
	}

	var eventMouseout = function(_d)    {
		var target = d3.select(this);
		var group = target[0][0].parentNode.parentNode;

		_utils.behindElement(group, _d.child_index, group.parentNode);
		_utils.tooltip();

		target
		.transition().duration(200)
		.style("stroke-width", function(_d)	{
			return 0;
		});
	}

	var getNowElementIndexOfChild = function(_target, _source)	{
		for(var i = 0, len = _source.length ; i < len ; i++)	{
			var child = d3.select(_source[i]);
			var target = d3.select(_target);

			if(child.attr("transform") === target.attr("transform"))	{
				return i;
			}
		}
	}

	var frontCircle = function()  {
		d3.selectAll(".marker_figures_path").forEach(function(_d, _i) {
			_d.sort(function(_a, _b)    {
				var a = d3.select(_a).datum();
				var b = d3.select(_b).datum();
				var result = (a.count + a.y < a.count + b.y) ? 1 : -1;
				return result;
			});
			frontFromParent(_d);
		});
	}

	var frontFromParent = function(_childs)    {
		_childs.forEach(function(_d)    {
			var group = _d.parentNode.parentNode;

			_utils.frontElement(group, group.parentNode);
		});
	}
	return {
		mover : eventMouseover,
		mout : eventMouseout,
		front : frontCircle
	}
})