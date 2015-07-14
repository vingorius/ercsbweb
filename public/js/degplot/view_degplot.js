define("degplot/view_degplot", ["utils", "size", "degplot/event_degplot"], function(_utils, _size, _e)	{
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
				_data.backgroundcolor(_utils.colour(Object.keys(_column)[i]), 
					cell_data, _data[Object.keys(_column)[i]].min, 
					_data[Object.keys(_column)[i]].max);
			}
		}
	}

	var lever = function(_id, _data, _width, _height)	{
		var key = _id.substring(_id.indexOf("_") + 1, _id.length);
		var margin = 5;

		var svg = d3.select("#" + _id)
		.append("svg")
		.attr("width", _width)
		.attr("height", _height)
		.append("g")
		.attr("transform", "translate(0, 0)")

		var x = _utils.linearScale(_data[key].min, _data[key].max, 0, _width - (margin * 2));

		var xAxis = d3.svg.axis()
		.scale(x)
		.orient("top").ticks(2)
		.tickValues([_data[key].min, _data[key].max]);

		svg.append("g")
		.attr("class", "deg_color_range_axis")
		.attr("transform", "translate(" + margin + ", " + (_height * 0.7) + ")")
		.call(xAxis);

		var figure = svg.append("rect")
		.data([{
			id : key,
			width : _width,
			margin : margin,
			min : _data[key].min,
			max : _data[key].max,
			bgcolor : _data.backgroundcolor
		}])
		.attr("class", "degplot_lever_rect")
		.attr("x", _width - margin).attr("y", _height / 2)
		.attr("width", 5).attr("height", _height / 2.5)
		.call(_e.drag);
	}

	var range_gradient = function(_id, _start, _end, _width, _height)	{
		var margin = 5;
		var svg = d3.select("#" + _id)
		.append("svg")
		.attr("width", _width)
		.attr("height", _height);

		var defs = svg.append("defs");
		var lineargradient = defs.append("linearGradient")
		.attr("id", _id + "_gradient")
		.attr("x1", "0").attr("y1", "0")
		.attr("x2", "100%").attr("y2", "0");

		lineargradient.append("stop")
		.attr("id", "gradient_start_" + _id)
		.attr("offset", "0%").attr("stop-color", _start);
		lineargradient.append("stop")
		.attr("id", "gradient_end_" + _id)
		.attr("offset", "100%").attr("stop-color", _end);

		svg.append("g")
		.attr("transform", "translate(0, 0)")
		.append("rect")
		.attr("x", 0).attr("y", 0)
		.attr("width", _width - margin)
		.attr("height", _height * 0.5)
		.style("fill", "url(#" + _id + "_gradient)");
	}

	var make_range_component = function(_data, _si, _width, _height)	{
		var range_component = 
		document.getElementById("degplot_color_bar_body");

		for(var i = 0, len = _si.length ; i < len ; i++)	{
			var row = _size.mkdiv();
			var comp_lever = _size.mkdiv({
				attribute : { id : "lever_" + _si[i], },
				style : { "width" : _width + "px", "height" : _height + "px" }
			});
			var comp_gradient = _size.mkdiv({
				attribute : { id : _si[i], },
				style : { "width" : _width + "px", "height" : _height + "px" }
			});

			row.appendChild(comp_lever);
			row.appendChild(comp_gradient);
			range_component.appendChild(row);
			
			lever("lever_" + _si[i], _data, _width, _height);	
			range_gradient(_si[i], "#FFFFFF", _utils.colour(_si[i]), _width, _height);
		}
	}

	var make_config_component = function(_data, _si, _width, _height)	{
		var config_component = 
		document.getElementById("degplot_color_config_body");
		var colors = _data.colors();

		for(var j = 0, leng = colors.length ; j < leng ; j++)	{
			var row = _size.mkdiv();

			var radio_div = _size.mkdiv({
				attribute : { id : "color_config_radio_div_" + j },
				style : {
					"float" : "left",
					"width" : (_width / (_si.length + 2)) + "px", "height" : _height + "px",
					"margin-bottom" : "5px" 
				}
			});

			var radio = document.createElement("input");
			radio.setAttribute("type", "radio")
			radio.setAttribute("class", "color_config_radio_button")
			radio.setAttribute("name", "color_config_radio")
			radio.setAttribute("id", "color_config_radio_" + j);

			if(j === 0)	{
				radio.setAttribute("checked", true);
			}

			radio_div.appendChild(radio);
			row.appendChild(radio_div);

			for(var i = 0, len = _si.length ; i < len ; i++)	{
				var comp_config = _size.mkdiv({
					attribute : { id : "config" + "_" + j + "_" + i },
					style : { 
						"float" : "left", 
						"width" : (_width / (_si.length + 1)) + "px", "height" : _height + "px",
						"margin-bottom" : "5px" 
					}
				});
				row.appendChild(comp_config);	
			}
			config_component.appendChild(row);

			for(var k = 0, lengt = _si.length ; k < lengt ; k++)	{
				range_gradient("config" + "_" + j + "_" + k, "#FFFFFF", colors[j][k], (_width / _si.length), _height);
			}
		}
	}

	var view = function(_data)	{
		var data = _data.data || [];
		var config_div = document.getElementById("degplot_color_config_heading");
		var tbody = _data.tbody || null;
		var padding_left = _utils.getNum(d3.select(config_div).style("padding-left"));
		var padding_right = _utils.getNum(d3.select(config_div).style("padding-right"));
		var width = config_div.clientWidth - padding_left - padding_right, height = 30;

		for(var i = 0, len = data.length ; i < len ; i++)	{
			create_cell(data[i], create_row(tbody), _data);
		}

		_e.rowspan(tbody.rows);

		make_range_component(_data, _data.si, width, height);
		make_config_component(_data, _data.si, width, height);

		$(".color_config_radio_button").on("click", function()	{
			_e.click_radio(this, _data, _data.si)
		});
	}

	return {
		view : view
	}
});	