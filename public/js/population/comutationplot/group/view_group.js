// 'use strict';
define("population/comutationplot/group/view_group", ["utils", "size", "population/comutationplot/vo_comutationplot", "population/comutationplot/group/event_group", "population/comutationplot/sort_comutationplot"], function(_utils, _size, _VO, _e, _sort)	{
	var view = function(_data)	{
		var size = _data.size;
		var svg = _size.mkSvg("#" + _data.class_name + "_groups", (_data.patients ? size.width : _VO.VO.getWidth()), size.height);
		var bar_init_x = _utils.ordinalScale((_data.patients ? _data.patients : _VO.VO.getInitSample()), 0, (_data.patients ? size.width : _VO.VO.getWidth()));
		var bar_init_y = 5;

		for(var i = 0, len = _data.data.length ; i < len ; i++)	{
			var y_pos = (i * 15) + size.margin.top;

			makeGroupBar(_data.class_name, _data.name[i], _data.data[i], svg, size, { x : 0, y : y_pos }, { x : bar_init_x, y : bar_init_y }, _data.colour);
		}
	}

	var makeGroupBar = function(_class, _name, _group, _svg, _size, _pos, _range, _colour)	{
		var bar_g = _svg.append("g")
		.attr("class", _class + "_bar_group_g")
		.attr("transform", "translate(" + _pos.x + ", " + _pos.y + ")")
		.selectAll("rect")
		.data(_group.length ? _group : [ _group ])
		.enter().append("rect")
		.attr("class", _class + "_bar_group_rects")
		.style("fill", function(_d)	{
			_d.name = _name;

			if(!_d.value)	{
				return "#d5dddd";
			}
			return _colour(_d.value).color;
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
		.attr({"y" : -_range.y, "width" : _range.x.rangeBand(), "height" : _range.y});
	}

	var nameView = function(_data)	{
		var size = _data.name_size;
		var bar_init_x = _utils.ordinalScale(_VO.VO.getInitSample(), _data.size.margin.left, (_data.size.width - _data.size.margin.left));
		var svg = _size.mkSvg("#comutationplot_groups_name", size.width, size.height);

		for(var i = 0, len = _data.data.length ; i < len ; i++)	{
			var group = _data.data[i];
			var name = _data.name[i];
			var x_pos = size.width - _utils.getTextSize(name, 8).width - 10;
			var y_pos = (i * 15) + size.margin.top;

			makeGroupName(name, group, svg, { x : x_pos, y : y_pos }, bar_init_x);
		}
	}

	var makeGroupName = function(_name, _group, _svg, _pos, _x)	{
		var name_g = _svg.append("g")
		.attr("class", "comutationplot_name_group_g")
		.attr("transform", "translate(" + _pos.x + ", " + _pos.y + ")")
		.append("text")
		.data([{
			name : _name,
			x : _x,
			order : true
		}])
		.attr({"class" : "comutationplot_name_group_text", "cursor" : "pointer"})
		.text(_name)
		.style({"fill" : "#626262", "font-size" : "8px"})
		.on({"mouseover" : _e.eover, "mouseout" : _e.mout})
		.on("click", function(_d)	{	
			var sort_order;
			var size = _sort.itemCount(_group);

			if(d3.event.altKey && _VO.VO.getSortOrder().length > 0)	{
				sort_order = _sort.separated(_group, size, _VO.VO.getSortOrder());
			}
			else{
				_VO.VO.setSortOrder([]);
				sort_order = _sort.separated(_group, size);
			}
			_e.clickSort(this, sort_order, _d);
		});
	}
	
	return	{
		view : view,
		nameView : nameView
	}
});