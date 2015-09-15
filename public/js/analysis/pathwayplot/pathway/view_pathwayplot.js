var PATHWAY = "analysis/pathwayplot/pathway/";

define(PATHWAY + "view_pathwayplot", ["utils", "size", PATHWAY + "event_pathwayplot"], function(_utils, _size, _event)   {
	var getInfoForRect = function(_g, _data, _gene_list)	{
		for(var i = 0, len = _g.length ; i < len ; i++)	{
			var g = _g[i];
			var g_id = g.attr("id");
			var name = g_id.substring(g_id.lastIndexOf("_") + 1, g_id.length).toUpperCase();
			var gene_in_data = _utils.getObject(name, _data, "gene_id");
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

	var pathwayTitle = function(_name, _sequence_num)	{
		// var title_group = d3.select("svg").insert("g", "g")
		// .attr("class", "pathwayplot_title_group")
		// .attr("transform", "translate(0, 0)");

		// var title = title_group.append("text")
		// .attr("class", "pathwayplot_title")
		// .text(function()	{
		// 	return _name + " ( " + _sequence_num + " )";
		// })
		console.log(_name, _sequence_num);
	}

	var view = function(_data)	{
		pathwayTitle(_data.data.cancer_type, _data.data.seq);
		getInfoForRect(_data.g, _data.data.pathway_list, _data.data.gene_list);
	}

	return 	{
		view : view
	}
});