define("degplot/view_degplot", ["utils", "size", "degplot/event_degplot"], function(_utils, _size, _event)	{
	var create_row = function(_tbody)	{
		return _tbody.insertRow(-1);
	}

	var create_cell = function(_column, _row, _data)	{
		for (var i = 0, len = Object.keys(_column).length ; i < len ; i++)	{
			var cell_data = _column[Object.keys(_column)[i]];

			_row.insertCell(i).innerHTML = cell_data;
			
			if(cell_data.constructor === Number && _row.cells[i].id === "")	{
				 _row.cells[i].innerHTML = "";
				 d3.select(_row.cells[i]).datum({
				 	id : Object.keys(_column)[i],
				 	data : cell_data
				 });
				_row.cells[i].style.backgroundColor = 
				_data.backgroundcolor(Object.keys(_column)[i], cell_data,
					_data[Object.keys(_column)[i]].min, 
					_data[Object.keys(_column)[i]].max);
			}
		}
	}

	var lever = function(_id, _data)	{
		var target = document.getElementById(_id);
		var key = _id.substring(_id.indexOf("_") + 1, _id.length);
		var margin = 20;

		var svg = d3.select("#" + _id)
		.append("svg")
		.attr("width", target.clientWidth)
		.attr("height", target.clientHeight)
		.append("g")
		.attr("transform", "translate(0, 0)")

		var x = _utils.linearScale(_data[key].min, _data[key].max, 
			0, (target.clientWidth - margin));

		var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(2)
		.tickValues([_data[key].min, _data[key].max]);

		svg.append("g")
		.attr("class", "deg_color_range_axis")
		.attr("transform", "translate(" + (margin / 2) + ", " 
			+ (target.clientHeight / 2) + ")")
		.call(xAxis);

		var figure = svg.append("rect")
		.data([{
			id : key,
			width : target.clientWidth,
			margin : margin,
			min : _data[key].min,
			max : _data[key].max,
			bgcolor : _data.backgroundcolor
		}])
		.attr("x", (target.clientWidth - margin / 2))
		.attr("y", target.clientHeight / 4)
		.attr("width", 10)
		.attr("height", 5)
		.call(_event.drag);
	}

	var range_gradient = function(_id, _start, _end)	{
		var target = document.getElementById(_id);
		var svg = d3.select("#" + _id)
		.append("svg")
		.attr("width", target.clientWidth)
		.attr("height", target.clientHeight);

		var defs = svg.append("defs");
		var lineargradient = defs.append("linearGradient")
		.attr("id", _id + "_gradient")
		.attr("x1", "0")
		.attr("y1", "0")
		.attr("x2", "100%")
		.attr("y2", "0");

		lineargradient.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", _start);
		lineargradient.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", _end);

		svg.append("g")
		.attr("transform", "translate(0, 0)")
		.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", target.clientWidth)
		.attr("height", target.clientHeight)
		.style("fill", "url(#" + _id + "_gradient)");
	}

	var view = function(_data)	{
		var data = _data.data || [];
		var tbody = _data.tbody || null;

		for(var i = 0, len = data.length ; i < len ; i++)	{
			create_cell(data[i], create_row(tbody), _data);
		}

		_event.rowspan(tbody.rows);

		lever("lever_si_log_p", _data);
		lever("lever_si_up_log_p", _data);
		lever("lever_si_down_log_p", _data);

		range_gradient("si_log_p", "#FFFFFF", _data.color_list[0]);
		range_gradient("si_up_log_p", "#FFFFFF", _data.color_list[1]);
		range_gradient("si_down_log_p", "#FFFFFF", _data.color_list[2]);
	}

	return {
		view : view
	}
});	