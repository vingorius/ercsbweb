var COMUTATION = "population/comutationplot/comutation/";

define(COMUTATION + "event_comutation", ["utils", "size"], function(_utils, _size)	{
	var tooltip = Object.create(_utils.tooltip);
	tooltip.div = $(".tooltip_chart");

	var getAllType = function(_all_child, _sign)	{
		var cnv = "", somatic = "", exp = "";

		for(var i = 0, len = _all_child.length ; i < len ; i++)	{
			var child = _all_child[i].__data__;
			var alter_type = _utils.defMutName(child.type);
			var type = _utils.alterationPrecedence(alter_type);

			if(type.alteration === "CNV")	{
				cnv += alter_type + "</br>";
			}
			else if(type.alteration === "mRNA Expression (log2FC)")	{
				exp += alter_type + "</br>";
			}
			else {
				somatic += alter_type + "</br>";
			}
		}
		return _sign === 0 ? cnv : _sign === 1 ? exp : _sign === 2 ? somatic : "";
	}

	var event_mouseover = function(_d)	{
		var target = d3.select(this);
		var class_name = target.attr("class");
		var sample_name = class_name.substring(class_name.indexOf(" ") + 1, class_name.indexOf("-"));
		var gene_name = class_name.substring(class_name.indexOf("-") + 1, class_name.length);
		var all_type = getAllType($("." + sample_name + "-" + gene_name), _d.sign);

		tooltip.show(this, 
			"<b>Gene mutations</b></br> x : " + _d.sample + "</br>y : " + _d.gene
			+ "</br>" + all_type, "rgba(15, 15, 15, 0.6)");

		target
		.transition().duration(50)
		.style("stroke", "#333")
		.style("stroke-width", 1);
	}

	var event_mouseout = function(_d)	{
		tooltip.hide();

		d3.select(this)
		.transition().duration(250)
		.style("stroke", function(_d)	{
			return "#fff";
		})
		.style("stroke-width", function(_d)	{
			return 0;
		});
	}

	var move_scroll = function()	{
		var target_1 = $("#comutationplot_sample");
		var target_2 = $("#comutationplot_border");
		var target_3 = $("#comutationplot_groups");

		target_2.scroll(function()	{
			var scroll = target_2.scrollLeft();
			
			target_1.scrollLeft(scroll);
			target_3.scrollLeft(scroll);
		});
	}
	return {
		m_over : event_mouseover,
		m_out : event_mouseout,
		move_scroll : move_scroll
	}
})