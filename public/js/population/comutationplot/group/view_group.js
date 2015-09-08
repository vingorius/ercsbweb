var GROUP = "population/comutationplot/group/";
var VO = "population/comutationplot/vo_comutationplot";
var SORT = "population/comutationplot/sort_comutationplot";

define(GROUP + "view_group", ["utils", "size", VO, GROUP + "event_group", SORT], function(_utils, _size, _VO, _e, _sort)	{
	var view = function(_data)	{
		var size = _data.size;
		var svg = _size.mkSvg("#" + _data.class_name + "_groups"
			, (_data.patients ? size.width : size.width * size.magnification), size.height);

		var bar_init_x = _utils.ordinalScale((_data.patients ? _data.patients : _VO.VO.getInitSample()), 0, (_data.patients ? size.width : _VO.VO.getInitWidth() * size.magnification));
		var bar_init_y = 8;

		for(var i = 0, len = _data.data.length ; i < len ; i++)	{
			var group = _data.data[i];
			var name = _data.name[i];
			var y_pos = (i * 20) + size.margin.top;

			makeGroupBar(_data.class_name, name, group, svg, size, { x : 0, y : y_pos }, { x : bar_init_x, y : bar_init_y }, _data.colour);
		}
	}

	var makeGroupBar = function(_class, _name, _group, _svg, _size, _pos, _range, _colour)	{
		var bar_g = _svg.append("g")
		.attr("class", _class + "_bar_group_g")
		.attr("transform", "translate(" + _pos.x + ", " + _pos.y + ")");

		var bar_rect = bar_g.selectAll("rect")
		.data(_group.length ? _group : [ _group ])
		.enter().append("rect")
		.attr("class", _class + "_bar_group_rects")
		.style("fill", function(_d)	{
			_d.name = _name;

			if(!_d.value)	{
				return "#d5dddd";
			}
			return _colour(_name, _d.value);
		})
		.on("mouseover", function(_d)	{
			_e.nover(this, _name, _d);
		})
		.on("mouseout", function()	{
			_e.mout(this, "rect");
		})
		.attr("x", function(_d)	{
			return _range.x(_d.sample);
		})
		.attr("y", -_range.y)
		.attr("width", function(_d)	{
			if(!_group.length)	{
				return _range.x.rangeBand();
			}
			return _range.x.rangeBand() / _size.left_between;
		})
		.attr("height", _range.y);
	}

	var nameView = function(_data)	{
		var size = _data.name_size;
		var bar_init_x = _utils.ordinalScale(_VO.VO.getInitSample(), _data.size.margin.left, (_data.size.width - _data.size.margin.left));
		var svg = _size.mkSvg("#comutationplot_groups_name", size.width, size.height);

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
			name : _name,
			x : _x,
			order : true
		}])
		.attr("class", "comutationplot_name_group_text")
		.text(_name)
		.on("mouseover", _e.eover)
		.on("mouseout", _e.mout)
		.on("click", function(_d)	{	
			var sort_order;

			if(d3.event.altKey && _VO.VO.getSortOrder().length > 0)	{
				sort_order = _sort.loopingMultiSort(_VO.VO.getSortOrder(), _group, _d.order);
				_e.clickSort(this, sort_order, _d);
			}
			else{
				_VO.VO.setSortOrder([]);
				sort_order = _sort.group(_group, _group, _VO.VO.getFormatedData().sample);
				_e.clickSort(this, sort_order, _d);
			}
		});
	}

	return	{
		view : view,
		nameView : nameView
	}
});