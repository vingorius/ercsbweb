var DEG = "degplot/";

define(DEG + "event_degplot", ["utils", "size"], function(_utils, _size)	{
	var now_si = "";	
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
		var targets = document.querySelectorAll("td");
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

	brightness.attr("x2", x2 + "%");
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

	return { value : x_final, scale : re_x };
}

var get_gradient_end = function(_id)	{
	return d3.select("#gradient_end_" + _id).attr("stop-color");
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
.on("drag", drag_lever).on("dragend", drag_end);

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
	if($(_color).attr("stop-color").toUpperCase() === _now_color.toUpperCase())	{
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

var m_cell_over = function(_d)	{
	_utils.tooltip(d3.event, 
		"<strong>name : <span style='color:red'>" + _d.id
		+ "</span></br> value : <span style='color:red'>" 
		+ Number(_d.data).toFixed(5),
		d3.event.pageX, d3.event.pageY);
}

var m_cell_out = function(_d)	{
	_utils.tooltip();
}

var select_color = function(_value, _color, _title)	{
	var title = $(this).attr("class");
	var si = title.substring(title.indexOf("-") + 1, title.lastIndexOf("_"));
	var color = $(this).val();
	var lever = d3.selectAll(".degplot_lever_rect");

	change_gradient(color, si);

	lever[0].forEach(function(_data, _i)	{
		var rect = d3.select(_data).datum();
		change_brightness(si, rect.min, rect.max, rect.max);
		lever.transition().duration(250)
		.attr("x", rect.width - rect.margin);
		if(rect.id === si)	{
			change_cell_background(rect.id, rect.min, rect.max, rect.bgcolor, color);
		}		
	});
}

return {
	cell_over : m_cell_over,
	cell_out : m_cell_out,
	rowspan : rowspan,
	drag : drag_figure,
	select_color : select_color
}
});	