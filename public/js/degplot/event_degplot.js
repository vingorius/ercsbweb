var DEG = "degplot/";

define(DEG + "event_degplot", ["utils", "size"], function(_utils, _size)	{
	var now_si = "";	// 캡슐화를 하여야 하는가? setter & getter 함수로

	var rowspan = function(_rows)	{
		var cell = "";
		var cells = [];

		for (var i = 0, len = _rows[0].cells.length ; i < len ; i++)	{
			for (var j = 0, leng = _rows.length ; j < leng ; j++)	{
				if(isNaN(Number(_rows[j].cells[i].innerHTML)))	{
					if(cell.innerHTML === _rows[j].cells[i].innerHTML)	{
						cell.rowSpan += 1;
						cells.push(_rows[j].cells[i])
					}
					cell = (cell === "" || cell.innerHTML !== _rows[j].cells[i].innerHTML) ?
					_rows[j].cells[i] : cell;
				}
			}
		}
		delete_cell(cells);
	}

	var delete_cell = function(_cell_list)	{
		for(var i = 0, len = _cell_list.length ; i < len ; i++)	{
			_cell_list[i].remove();
		}
	}

	var change_cell_background = function(_target, _min, _value, _bgcolor, _rgb)	{
		var targets = document.getElementsByTagName("td");
		var rgb = _rgb || _utils.colour(_target);

		for(var i = 0, len = targets.length ; i < len ; i++)	{
			if(targets[i].style.backgroundColor && 
				d3.select(targets[i]).datum().id === _target)	{
				d3.select(targets[i]).transition().duration(500)
				.style("background-color", _bgcolor(rgb, d3.select(targets[i]).datum().data, 
						_min, _value));
			}
		}
	}

	var change_gradient = function(_color, _si)	{
		d3.select("#gradient_end_" + _si)
		.transition().duration(500)
		.attr("stop-color", _color);
	}

	var change_brightness = function(_target, _min, _max, _value)	{
		var brightness = d3.select("#" + _target + "_gradient");
		var percent = 100;
		var x2 = (Math.round((percent * _value) / (_max - _min)) === 0) ?
		1 : Math.round((percent * _value) / (_max - _min));

		brightness
		.attr("x2", x2 + "%");
	}

	var relocate_bar = function(_target, _d)	{
		var target = _target || null;

		var x = d3.scale.linear()
		.domain([_d.margin / 2, _d.width - _d.margin])
		.range([_d.min, Math.round(_d.max)]);
		var re_x = d3.scale.linear()
		.domain([_d.min, Math.round(_d.max)])
		.range([_d.margin / 2, _d.width - _d.margin]);

		var start = Math.floor(x(Number(target.attr("x"))));
		var end = Math.floor(x(Number(target.attr("x")))) + 1;
		var sub_start = Math.abs(start - x(Number(target.attr("x"))));
		var sub_end = Math.abs(end - x(Number(target.attr("x"))));
		var x_final = (sub_start > sub_end) ? end : start;

		return {
			value : x_final,
			scale : re_x
		};
	}

	var get_gradient_end = function(_id)	{
		return d3.select("#gradient_end_" + _id)
		.attr("stop-color");
	}

	var drag_end = function(_d)	{
		var target = d3.select(this);
		var reloc = relocate_bar(target, _d);

		target.attr("x", reloc.scale(reloc.value));

		change_brightness(_d.id, _d.min, Math.round(_d.max), reloc.value);
		change_cell_background(_d.id, _d.min, reloc.value, _d.bgcolor, get_gradient_end(_d.id));

		_utils.tooltip();
	}

	var drag_lever = function(_d)	{
		var target = d3.select(this);
		var reloc = relocate_bar(target, _d);

		_utils.tooltip();

		target
		.attr("x", function()	{
			_utils.tooltip(d3.event, reloc.value, 
				d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY - 30);
			
			return Math.max((_d.margin / 2), 
				Math.min(_d.width - _d.margin, Number(target.attr("x")) + d3.event.dx));
		});
	}

	var drag_figure = d3.behavior.drag()
	.origin(Object)
	.on("drag", drag_lever)
	.on("dragend", drag_end);

	var all_colors = function()	{
		var all_colors = d3.selectAll("stop")[0];
		var result = [];

		for(var i = 0, len = all_colors.length ; i < len ; i++)	{
			if(all_colors[i].id.indexOf("end_color_list") > -1)	{
				result.push(all_colors[i]);
			}
		}
		return result;
	}

	var find_color = function(_target, _color, _now_color)	{
		if($(_color).attr("stop-color").toUpperCase() 
			=== _now_color.toUpperCase())	{
			d3.select("#" + _target + " svg").style("border", "2px solid yellow");
		}
		else {
			d3.select("#" + _target + " svg").style("border", "");
		}
	}

	var find_what_in_all_colors = function(_all_color, _now_color)	{
		for(var i = 0, len = _all_color.length ; i < len ; i++)	{
			var color_num = _utils.getNum($(_all_color[i]).attr("id"));
			var target = "color_list_" + color_num;

			find_color(target, _all_color[i], _now_color);			
		}
	}

	var set_selected_button = function(_target)	{
		var all_area = $(".gradient_area");
		var check_id = _target.substring(0, _target.indexOf("_"));

		for(var i = 0, len = all_area.length ; i < len ; i++)	{
			var svg = $(all_area[i]);
			var classname = svg.attr("class");
			if(classname.indexOf(check_id) > -1)	{
				if(classname.indexOf(_target) > -1)	{
					svg.css("border", "2px solid yellow");
				}
				else {
					svg.css("border", "");
				}
			}
		}
	}

	var colors_click = function(_d)	{
		var target = this.id.substring(this.id.indexOf("_") + 1, this.id.length);
		var now_color = get_gradient_end(target);
		var color_config = $("#color_config");

		color_config.collapse("hide");
		setTimeout(function()	{ color_config.collapse("show"); }, 400);

		var all_color = all_colors();

		set_selected_button(target);

		now_si = target;
		find_what_in_all_colors(all_color, now_color);
	}

	var click_color_cell = function(_d)	{
		var target = _d.id.substring(_d.id.lastIndexOf("_") + 1, _d.id.length);
		var all_color = all_colors();
		var index = _utils.getNum(_d.id);

		find_what_in_all_colors(all_color, _d.color);
		change_gradient(_d.color, now_si);

		d3.selectAll(".degplot_lever_rect")[0].forEach(function(_data, _i)	{
			var rect = d3.select(_data).datum();
			
			if(rect.id === now_si)	{
				change_cell_background(rect.id, rect.min, rect.max, rect.bgcolor, _d.color);
			}		
		});
	}

	return {
		rowspan : rowspan,
		drag : drag_figure,
		colors : colors_click,
		color_cell : click_color_cell
	}
});	