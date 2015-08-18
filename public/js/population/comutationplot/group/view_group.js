var GROUP = "population/comutationplot/group/";
var VO = "population/comutationplot/vo_comutationplot";

define(GROUP + "view_group", ["utils", "size", VO, GROUP + "event_group"], function(_utils, _size, _VO, _e)	{
	var view = function(_data)	{
		var size = _data.size;
		var vo = _VO.VO;

		var svg = d3.select("#comutationplot_groups")
		.append("svg")
		.attr("class", "comutationplot_groups")
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var bar_init_x = _utils.ordinalScale(vo.getInitSample(), size.margin.left, size.width - size.margin.left);
		var bar_init_y = 8;

		for(var i = 0, len = _data.data.length ; i < len ; i++)	{
			var group = _data.data[i];
			var name = _data.name[i];
			var y_pos = (i * 20) + size.margin.top;

			makeGroupBar(name, group, svg, { x : 0, y : y_pos }, { x : bar_init_x, y : bar_init_y }, _data.colour);
		}
	}

	var makeGroupBar = function(_name, _group, _svg, _pos, _range, _colour)	{
		var bar_g = _svg.append("g")
		.attr("class", "comutationplot_bar_group_g")
		.attr("transform", "translate(" + _pos.x + ", " + _pos.y + ")");

		var bar_rect = bar_g.selectAll(".comutationplot_bar_group_rects")
		.data(_group)
		.enter().append("rect")
		.attr("class", "comutationplot_bar_group_rects")
		.style("fill", function(_d)	{
			if(!_d.value)	{
				return "#d5dddd";
			}
			return _colour(_name, _d.value);
		})
		.on("mouseover", _e.nover)
		.on("mouseout", _e.nout)
		.attr("x", function(_d)	{
			_d.x = _range.x;
			return _range.x(_d.sample);
		})
		.attr("y", -_range.y)
		.attr("width", _range.x.rangeBand())
		.attr("height", _range.y);
	}

	var nameView = function(_data)	{
		var size = _data.name_size;
		var vo = _VO.VO;
		var bar_init_x = _utils.ordinalScale(vo.getInitSample(), _data.size.margin.left, (_data.size.width - _data.size.margin.left));

		var svg = d3.select("#comutationplot_groups_name")
		.append("svg")
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		for(var i = 0, len = _data.data.length ; i < len ; i++)	{
			var group = _data.data[i];
			var name = _data.name[i];
			var x_pos = size.width - _utils.getTextSize(name, 8).width - 10;
			var y_pos = (i * 20) + size.margin.top;

			makeGroupName(name, group, svg, { x : x_pos, y : y_pos }, bar_init_x);
		}
	}

	var makeGroupName = function(_name, _group, _svg, _pos, _x)	{
		var name_g = _svg.append("g")
		.attr("class", "comutationplot_name_group_g")
		.attr("transform", "translate(" + _pos.x + ", " + _pos.y + ")");

		var name_text = name_g.append("text")
		.data([{
			x : _x
		}])
		.attr("class", "comutationplot_name_group_text")
		.text(_name)
		.on("click", function()	{
			_e.nclick(this, _name, _group);
		});
	}

	return	{
		view : view,
		nameView : nameView
	}
});