"use strict";
define("analysis/pathwayplot/pathway/event_pathwayplot", ["utils", "size"], function(_utils, _size)   {
	var twinklRect = function(_rect, _color, _width)	{
		_size.styleStroke(_rect, _color, _width, 500);
	}

	var mouseOver = function(_d)	{
		var parent = d3.select(this)[0][0].parentNode;
		var grand_parent = parent.parentNode;
		var rect = d3.select(parent).select("rect");
		var text = d3.select(parent).select("text");

		insertRectData(_d, parent, grand_parent, rect, text);

		_utils.tooltip.show(rect[0][0], 
			"<b>" + _d.name + "</b></br>frequency : " 
			+ (_d.frequency === null ? "NA" : _d.frequency) + "</br><span style='color : " 
			+ (_d.active === null ? "#E8E8E8" : _d.active === "Y" ? "red" : "blue") + "'><b>" 
			+ (_d.active === null ? "NA" : _d.active === "Y" ? "Activated" : "Inactivated") 
			+ "</b></span>", "rgba(15, 15, 15, 0.6)");
	
		_utils.frontElement(parent, grand_parent);

		rect
		.attr({"x" : rect.attr("x"), "y" : rect.attr("y"), "width" : rect.attr("width"), "height" : rect.attr("height"),});

		animate(rect, text, _d, true);
	}

	var mouseOut = function(_d)	{
		var parent = d3.select(this)[0][0].parentNode;
		var parent_g = d3.select(parent);
			
		_utils.behindElement(parent, _d.child_index, parent.parentNode);
		_utils.tooltip.hide();

		animate(parent_g.select("rect"), parent_g.select("text"), _d, false);
	}

	var insertRectData = function(_d, _parent, _grand_parent, _rect, _text)	{
		_d.x = _d.x || _rect.attr("x");
		_d.y = _d.y || _rect.attr("y");
		_d.width = _d.width || _rect.attr("width");
		_d.height = _d.height || _rect.attr("height");
		_d.font_size = _d.font_size || _text.style("font-size");
		_d.child_index = _d.child_index || initElementIndex(_d, _grand_parent.childNodes, _parent);
	}

	var initElementIndex = function(_d, _all_child, _source)	{
		for(var i = 0, len = _all_child.length ; i < len ; i++)	{
			var child = $(_all_child[i])[0];

			if(child.id && (/gene_/i).test(child.id))	{
				if(_source.id === child.id)	{
					return i;
				}
			}
		}
	}

	var animate = function(_rect, _text, _d, _is)	{
		_rect
		.attr("x", (_is ? +_d.x - (_d.width / 10) : _d.x) + "px")
		.attr("y", (_is ? +_d.y - (_d.height / 10) : _d.y) + "px")
		.attr("width", (_is ? +_d.width + (_d.width / 5) : _d.width) + "px")
		.attr("height", (_is ? +_d.height + (_d.height / 5) : _d.height) + "px")
		.style("stroke-width", _is ? "2px" : "1px");

		_text
		.style("font-size", _is ? _utils.getNum(_d.font_size) * 1.25 + "px" : _d.font_size);
	}

	var drugMouseOver = function(_d)	{
		var source = d3.select(this);

		_utils.frontElement(source, source[0][0].parentNode);
		_size.styleStroke(source.selectAll("path"), "#FBFD24", 20);
	}

	var drugMouseOut = function(_d)	{
		_size.styleStroke(d3.select(this).selectAll("path"), "#fff", 0);
	}

	var drugClick = function(_cancer_type)	{
		var gene = this.id.split("_");
		
		$("#drug_modal_label").html("<big class='drug_gene_name'>" + gene[1].toUpperCase() +"</big>");
		$("#pathwayplot_table").bootstrapTable("refresh", {
			url : "/models/drug/getPathwayDrugList?pathway_gene=" + gene[1] + "&cancer_type=" + _cancer_type, 
		});
	}
	return 	{
		m_over : mouseOver,
		m_out : mouseOut,
		d_over : drugMouseOver,
		d_out : drugMouseOut,
		d_click : drugClick,
		twinkl : twinklRect
	}
});