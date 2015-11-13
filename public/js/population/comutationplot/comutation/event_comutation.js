// 'use strict';
define("population/comutationplot/comutation/event_comutation", ["utils", "size"], function(_utils, _size)	{
	var getAllType = function(_all_child, _sign)	{
		var cnv = [], somatic = [], exp = [];

		for(var i = 0, len = _all_child.length ; i < len ; i++)	{
			var child = _all_child[i].__data__;
			var alter_type = _utils.mutate(child.type).name;

			switch(_utils.alterationPrecedence(alter_type).alteration)	{
				case "CNV" : cnv.push(alter_type); break;
				case "mRNA Expression (log2FC)" : exp.push(alter_type); break;
				case "Somatic Mutation" : somatic.push(alter_type); break;
			}
		}
		return _sign === 0 ? sortAlteration(cnv) : _sign === 1 ? sortAlteration(exp) : _sign === 2 ? sortAlteration(somatic) : "";
	}

	var sortAlteration = function(_data)	{
		return _data.sort(1).join("</br>");
	}

	var event_mouseover = function(_d)	{
		var target = d3.select(this);
		var class_name = target.attr("class");
		var sample_name = class_name.substring(class_name.indexOf(" ") + 1, class_name.indexOf("-"));
		var gene_name = class_name.substring(class_name.indexOf("-") + 1, class_name.length);
		var all_type = getAllType($("." + sample_name + "-" + gene_name), _d.sign);

		_utils.tooltip.show(this, "<b>Gene mutations</b></br> x : " + _d.sample + "</br>y : " + _d.gene + "</br>" + all_type, "rgba(15, 15, 15, 0.6)");
		_size.styleStroke(target, "#333", 1, 50);
	}

	var event_mouseout = function(_d)	{
		_utils.tooltip.hide();
		_size.styleStroke(d3.select(this), "#fff", 0, 250);
	}

	var move_scroll = function()	{
		$("#comutationplot_border")
		.scroll(function()	{
			$("#comutationplot_sample, #comutationplot_groups").scrollLeft($(this).scrollLeft());
		});
	}
	
	return {
		m_over : event_mouseover,
		m_out : event_mouseout,
		move_scroll : move_scroll
	}
})