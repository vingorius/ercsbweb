define("analysis/pathwayplot/pathway/view_pathwayplot", ["utils", "size", "analysis/pathwayplot/pathway/event_pathwayplot"], function(_utils, _size, _event)   {
	"use strict";
	var makePathway = function(_g, _data)	{
		for(var i = 0, len = _g.length ; i < len ; i++)	{
			var gene = _g[i];
			var gene_data = _utils.getObject(gene.text.text(), _data.pathway_list, "gene_id");
			var frequency = !gene_data ? null : gene_data.frequency;
			var is_activated = !gene_data ? null : gene_data.active;
			var data_set = setData(gene.text.text(), frequency, is_activated);

			fillRect(gene.rect, data_set, $.inArray(gene.text.text(), _data.gene_list));
			fillText(gene.text, data_set);
		}
	}

	var setData = function(_name, _frequency, _active)	{
		return [{
			name : _name,
			frequency : _frequency,
			active : _active,
			x : "",
			y : "",
			width : "",
			height : "",
			font_size : "",
			child_index : 0,
		}];
	}

	var fillText = function(_text, _data_set)	{
		_text
		.data(_data_set)
		.style("fill", function(_d)	{
			return _d.frequency >= 30 ? "#f2f2f2" : "#333";
		})
		.attr("cursor", "pointer")
		.on({"mouseover" : _event.m_over, "mouseout" : _event.m_out});
	}

	var fillRect = function(_rect, _data_set, _is_marker)	{
		if(_is_marker >= 0)	{
			var marker = false;

			setInterval(function()	{
				marker = marker ? false : true;
				_event.twinkl(_rect, marker ? "#ff0000" : "#333", marker ? "3px" : "1px");
			}, 500);
		}
		_rect
		.data(_data_set)
		.style("fill", matchingColor)
		.attr("cursor", "pointer")
		.on({"mouseover" : _event.m_over, "mouseout" : _event.m_out});
	}

	var matchingColor = function(_d)	{
		var base_color = d3.hsl(_d.active === "Y" ? "red" : "blue");
		var color_range = _utils.linearScale(0, 50, 1, 0.5);

		base_color.l = color_range(_d.frequency);

		return !_d.active && !_d.frequency ? "#d0d0d0" : base_color;
	}

	var view = function(_data)	{
		makePathway(_data.gene, _data.data);

		_data.drug
		.on({"click" : _event.d_click, "mouseover" : _event.d_over, "mouseout" : _event.d_out});
	}
	
	return 	{
		view : view
	};
});