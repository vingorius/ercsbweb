var PATHWAY = "analysis/pathwayplot/pathway/";

define(PATHWAY + "view_pathwayplot", ["utils", "size", PATHWAY + "event_pathwayplot"], function(_utils, _size, _event)   {
	var getInfoForRect = function(_g, _data, _gene_list)	{
		for(var i = 0, len = _g.length ; i < len ; i++)	{
			var g = _g[i];
			var g_id = g.attr("id");
			var name = g_id.substring(g_id.lastIndexOf("_") + 1, g_id.length).toUpperCase();
			var gene_in_data = _utils.getObjInArray(name, _data, "gene_id");
			var frequency = !gene_in_data ? null : gene_in_data.frequency;
			var is_activated = !gene_in_data ? null : gene_in_data.active;
			var data_set = makeDataSet(name, frequency, is_activated);
			
			fillRect(g.select("rect"), data_set, $.inArray(name, _gene_list));
			fillText(g.select("text"), data_set);
		}
	}

	var makeDataSet = function(_name, _frequency, _active)	{
		return [{
			name : _name,
			frequency : _frequency,
			active : _active,
			x : "",
			y : "",
			tx : "",
			ty : "",
			width : "",
			height : "",
			font_size : "",
			child_index : 0,
		}];
	}

	var fillText = function(_text, _data_set)	{
		_text
		.data(_data_set)
		.on("click", _event.click)
		.on("mouseover", _event.m_over)
		.on("mouseout", _event.m_out)
		.style("fill", function(_d)	{
			var base_color = _d.frequency >= 30 ? "#f2f2f2" : "#333";

			return base_color;
		});
	}

	var fillRect = function(_rect, _data_set, _is_marker)	{
		var mark_name = "pathwayplot_gene_rect";
		
		if(_is_marker >= 0)	{
			mark_name = "pathwayplot_gene_rect_target";
			var marker = false;

			// _event.twinkl(_rect, "#FFF400");
			setInterval(function()	{
				marker = marker ? false : true;
				_event.twinkl(_rect, marker ? "#fff400" : "#333", marker ? "2px" : "1px");
			}, 750);
		}

		_rect
		.attr("class", mark_name)
		.data(_data_set)
		.style("fill", matchingColor)
		.on("click", _event.click)
		.on("mouseover", _event.m_over)
		.on("mouseout", _event.m_out);
	}

	var matchingColor = function(_d)	{
		var base_color = d3.hsl(_d.active === "Y" ? "red" : "blue");
		var color_range = _utils.linearScale(0, 50, 1, 0.5);

		if(_d.active === null && _d.frequency === null)	{
			return "#e8e8e8";
		}
		if(_d.frequency >= 50)	{
			return base_color;
		}
		base_color.l = color_range(_d.frequency);
		return base_color;
	}

	// var fillGradient = function(_gradient)	{
	// 	_gradient
	// 	.style("fill", "url(#pathwayplot_gradient_frequency)");

	// 	var defs = d3.select("svg").append("defs");
	// 	var linear_gradient = defs.append("linearGradient")
	// 	.attr("id", "pathwayplot_gradient_frequency")
	// 	.attr("x1", "0")
	// 	.attr("y1", "0")
	// 	.attr("x2", "100%")
	// 	.attr("y2", "0");

	// 	makeStopElement(linear_gradient, "gradient_frequency_stop_inactivated", "0%", "blue");
	// 	makeStopElement(linear_gradient, "gradient_frequency_stop_middle", "50%", "white");
	// 	makeStopElement(linear_gradient, "gradient_frequency_stop_activated", "100%", "red");
	// }

	// var makeStopElement = function(_source, _id, _offset, _stop_color)	{
	// 	_source.append("stop")
	// 	.attr("id", _id)
	// 	.attr("offset", _offset)
	// 	.attr("stop-color", _stop_color);
	// }

	var view = function(_data)	{
		// fillGradient(_data.gradient);
		getInfoForRect(_data.g, _data.data.pathway_list, _data.data.gene_list);
	}

	return 	{
		view : view
	}
});