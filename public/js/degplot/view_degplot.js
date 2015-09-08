var DEG = "degplot/";

define(DEG + "view_degplot", ["utils", "size", DEG + "event_degplot"], function(_utils, _size, _e)	{
	var minAndMax = function(_min_max, _key)	{
		for(var i = 0, len = _min_max.length ; i < len ; i++)	{
			if(_min_max[i][_key])	{ return _min_max[i][_key]; }
		}
	}

	var mkRow = function(_tbody)	{
		return _tbody.insertRow(-1);
	}

	var mkCell = function(_column, _row, _data)	{
		for (var i = 0, len = Object.keys(_column).length ; i < len ; i++)	{
			var cell_data = _column[Object.keys(_column)[i]];

			_row.insertCell(i).innerHTML = cell_data;
			
			if(cell_data.constructor === Number && _row.cells[i].id === "")	{
				_row.cells[i].innerHTML = "";

				d3.select(_row.cells[i]).datum({
					id : Object.keys(_column)[i],
					data : cell_data
				});

				d3.select(_row.cells[i]).style("background-color", function(_d) {
					var minmax = minAndMax(_data.min_max, Object.keys(_column)[i]);
					return _data.backgroundcolor(_utils.colour(Object.keys(_column)[i]), 
						cell_data, minmax.min, minmax.max)
				})
				.on("mouseover", _e.cell_over)
				.on("mouseout", _e.cell_out);
			}
		}
	}

	var lever = function(_id, _data, _width, _height)	{
		var key = _id.substring(_id.indexOf("_") + 1, _id.length);
		var margin = 5;
		var minmax = minAndMax(_data.min_max, key);

		var svg = d3.select("#" + _id)
		.append("svg")
		.attr("width", _width)
		.attr("height", _height)
		.append("g")
		.attr("transform", "translate(0, 0)")

		var x = _utils.linearScale(minmax.min, minmax.max, 0, _width - (margin * 2));

		var xAxis = d3.svg.axis()
		.scale(x).orient("top").ticks(2)
		.tickValues([minmax.min, minmax.max]);

		svg.append("g")
		.attr("class", "degplot_axis_color_range")
		.attr("transform", "translate(" + margin + ", " + (_height * 0.7) + ")")
		.call(xAxis);

		var figure = svg.append("rect")
		.data([{
			id : key,
			width : _width,
			margin : margin,
			min : minmax.min,
			max : minmax.max,
			bgcolor : _data.backgroundcolor
		}])
		.attr("class", "degplot_lever_rect")
		.attr("x", _width - margin)
		.attr("y", _height / 2)
		.attr("width", 5)
		.attr("height", _height / 2.5)
		.call(_e.drag);
	}

	var gradient = function(_id, _start, _end, _width, _height)	{
		var pre_id = "";
		var margin = 5;

		if(_id.indexOf("color_list") > -1)	{ pre_id = "gradients_ "; }
		else { pre_id = "gradient_area "; }

		var svg = d3.select("#" + _id)
		.append("svg")
		.attr("class", pre_id + _id)
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
		.data([{ this : svg, id : _id, color : _end }])
		.attr("x", 0).attr("y", 0)
		.attr("width", _width - margin)
		.attr("height", _height)
		.style("fill", "url(#" + _id + "_gradient)")
		.on("click", _e.color_cell);
	}

	var mkSpanWithOpt = function(_data, _si, _width, _height)	{
		var option = _size.mkdiv({
			attribute : "", style : { float : "left",
			"padding-left" : "5px",
			"padding-top" : "35px"
			, "width" : (_width * 0.2) + "px"
			, "height" : _height * 2 + "px" }
		});
		var colors = _data.colors();
		var colorselector = document.createElement("select");
		colorselector.setAttribute("id", "colorselector");
		colorselector.setAttribute("class", "degplot_colorselector -" + _si + "_colors");

		for(var i = 0, len = colors.length ; i < len ; i++)	{
			var colorselector_option = document.createElement("option");
			if(_utils.colour(_si) === colors[i])	{
				colorselector_option.setAttribute("selected", true);
			}
			colorselector_option.setAttribute("data-color", colors[i]);
			colorselector_option.setAttribute("value", colors[i]);
			colorselector.add(colorselector_option);
		}
		option.appendChild(colorselector);

		return option;
	}

	var mkRangeComponent = function(_data, _si, _width, _height)	{
		var range_component = 
		document.querySelector("#degplot_color_bar_body");

		for(var i = 0, len = _si.length ; i < len ; i++)	{
			var row = _size.mkdiv();
			var component = _size.mkdiv({
				attribute : "", 
				style : { 
					float : "left", 
				}
			});
			var option = mkSpanWithOpt(_data, _si[i], _width, _height);
			var comp_lever = _size.mkdiv({
				attribute : { 
					id : "lever_" + _si[i]
				},
				style : { 
					"width" : _width * 0.8 + "px", 
					"height" : _height + "px" 
				}
			});
			var comp_gradient = _size.mkdiv({
				attribute : { 
					id : _si[i] 
				},
				style : {
				 "width" : _width * 0.8 + "px", 
				 "height" : _height + "px" 
				}
			});

			component.appendChild(comp_lever);
			component.appendChild(comp_gradient);
			row.appendChild(component);
			row.appendChild(option);
			range_component.appendChild(row);

			lever("lever_" + _si[i], _data, _width * 0.8, _height);	
			gradient(_si[i], "#FFFFFF", _utils.colour(_si[i]), _width * 0.8, _height);
		}
	}

	var view = function(_data)	{
		var data = _data.data || [];
		var config_div = document.querySelector("#degplot_color_bar_heading");
		var tbody = _data.tbody || null;
		var padding_left = _utils.getNum(d3.select(config_div).style("padding-left"));
		var padding_right = _utils.getNum(d3.select(config_div).style("padding-right"));
		var width = config_div.clientWidth - padding_left - padding_right, height = 30;

		for(var i = 0, len = data.length ; i < len ; i++)	{
			mkCell(data[i], mkRow(tbody), _data);
		}
		_e.rowspan(tbody.rows);
		mkRangeComponent(_data, _data.si, width, height);

		$(".degplot_colorselector").simplecolorpicker({ picker : true }).on("change", _e.select_color)

		d3.selectAll(".gradient_area rect").on("click", _utils.preserve_events);
	}

	return {
		view : view
	}
});	