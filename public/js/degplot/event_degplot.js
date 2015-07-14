define("degplot/event_degplot", ["utils", "size"], function(_utils, _size)	{
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
				targets[i].style.backgroundColor = 
					_bgcolor(rgb, d3.select(targets[i]).datum().data, 
						_min, _value);
			}
		}
	}

	var change_gradient = function(_colors, _color_index, _si)	{
		for(var i = 0, len = _si.length ; i < len ; i++)	{
			d3.select("#gradient_end_" + _si[i])
			.attr("stop-color", _colors[_color_index][i]);
		}
	}

	var change_brightness = function(_target, _min, _max, _value)	{
		var brightness = d3.select("#" + _target + "_gradient");
		var percent = 100;
		var x2 = Math.round((percent * _value) / (_max - _min));

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

	var click_radio = function(_target, _data, _si)	{
		var color_index = _utils.getNum(_target.id);
		var colors = _data.colors();

		change_gradient(colors, color_index, _si);

		d3.selectAll(".degplot_lever_rect")[0].forEach(function(_d, _i)	{
			var rect = d3.select(_d).datum();
			
			change_cell_background(rect.id, rect.min, rect.max, rect.bgcolor, colors[color_index][_i]);
		});
	}

	return {
		rowspan : rowspan,
		drag : drag_figure,
		click_radio : click_radio
	}
});	