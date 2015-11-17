"use strict";
define("analysis/pathwayplot/pathway/setting_pathwayplot", ["utils", "size", "analysis/pathwayplot/pathway/view_pathwayplot"], function(_utils, _size, _view)   {
	var getGenes = function(_all_txt, _pathway_list)	{
		var result = [];

		for(var i = 0, len = _all_txt.length ; i < len ; i++)	{
			var item = _all_txt[i];
			var is_gene = _utils.getObject(item.textContent, _pathway_list, "gene_id");

			if(is_gene || (/gene_/i).test(item.parentNode.id))	{
				result.push({
					g : d3.select(item.parentNode),
					text : d3.select(item),
					rect : d3.select(item.parentNode).select("rect"),
				})
			}
		}
		return result;
	}

	var getDrugs = function(_cancer_type)		{
		return d3.selectAll("g[id*='drug_']")
		.datum(_cancer_type)
		.attr("cursor", "pointer");
	}

	var setColumns = function(_class, _field, _title, _func)		{
		var add_columns = ["halign", "valign", "align"];
		var column_set = { class : _class, field : _field, title : _title, formatter : _func, }

		return function()	{
			for(var i = 4, len = arguments.length ; i < len; i++)	{
				column_set[add_columns[i - 4]] = arguments[i];
			}
			return column_set;
		}
	}

	var setDrugTable = function()	{
		var table = $("#pathwayplot_table");
		var agent = new setColumns("drug_modal_agent", "agent", "Drug", agentFormatter, "center", "middle")();
		var drug_class = new setColumns("drug_modal_drug_class", "drug_class", "Levels of approval", approvedFormatter, "center", "middle", "center")();
		var cancer = new setColumns("drug_modal_cancer", "cancer", "Treated Cancer", cancerFormatter, "center", "middle")();
		var reference = new setColumns("drug_modal_reference", "source", "Reference", referenceFormatter, "center", "middle")();

		table.bootstrapTable({
			url : "",
			height : "auto",
			cache : false,
			columns : [ agent, drug_class, cancer, reference ]
		})
		.on("load-success.bs.table", function()	{
			$(".drug_modal")
			.css({"top" : 0, "left" : 0})
			.draggable({ handle : ".modal-header" })
			.on("show.bs.modal", function()	{
				$(".fixed-table-container").css("padding-bottom", "0px");
			})
			.on("hide.bs.modal", function()	{
				table.bootstrapTable("removeAll");
			})
			.modal(	{
				keyboard : false,
				backdrop : "static"
			});
		});
	}

	var drugInfo = function(_row) 	{
		this.row = _row;
	}
	drugInfo.prototype.attr = function()	{
		return {
			"type1" : { class : "agent-red", color : "red" },
			"type2" : { class : "agent-blue", color : "blue" },
			"type3" : { class : "agent-black", color : "black" },
		}[this.row.drug_type];
	}
	drugInfo.prototype.url = function()	{
		return this.row.nci_id ? 
		'http://www.cancer.gov/about-cancer/treatment/drugs/' + this.row.nci_id : 
		(!this.row.nci_id && this.row.dailymed_id) ? 
		'http://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=' + this.row.dailymed_id : null;
	}
	
	var agentFormatter = function(_value, _row)	{
		var drug = new drugInfo(_row);
		var drug_icon = document.getElementById("legend_icon_" + drug.attr().color).cloneNode(true);
		var svg = document.createElement("svg");
		var icon_size = 15;

		svg.setAttribute("width", icon_size);
		svg.setAttribute("height", icon_size);
		drug_icon.setAttribute("transform", "matrix(0.023, 0, 0, 0.032, 0, 0)");
		svg.appendChild(drug_icon);

		return drug.url() != null ? 
		svg.outerHTML + "<a href=" + drug.url() + " target=\'drug\'><span class='underline " + drug.attr().class + "'>" + _value + "</span></a>" : 
		svg.outerHTML + "<span class='" + drug.attr().class + "'>" + _value + "</span>";
	}

	var approvedFormatter = function(_value, _row)	{
		return _value;
	}

	var cancerFormatter = function(_value, _row)	{
		var value = _value || "NA";

		return "<span title='" + value + "'>" + value + "</span>";
	}

	var referenceFormatter = function(_value, _row)	{
		return "<span title='" + _value + "'>" + _value + "</span>";
	}

	var locate = function(_func)	{
		var svg = d3.select("#svg4601");
		var base = $("#maincontent");
		var container = $(".chart_container");

		container
		.css("margin-left", _utils.getNum(container.css("marginLeft")) - _utils.getNum(base.css("paddingLeft")));

		return _func(svg, +svg.attr("width"), +svg.attr("height"), base, 
			window.screen.width - _utils.getNum(base.css("marginLeft")), 
			$(document).height() - _utils.getNum(base.css("marginTop")), container);
	}

	var getLocation = function(_width_svg, _height_svg, _width_real, _height_real)	{
		return {
			posx : ((_width_real / 2) - (_width_svg / 2)),
			posy : ((_height_real / 2) - (_height_svg / 2)),
		};
	}

	return function(_data)	{
		locate(function(_svg, _width, _height, _base, _width_base, _height_base, _container)	{
			window.onresize = function(_e)	{
				var loc = getLocation(_width, _height, _width_base, _height_base);
				var perx = Math.round((_base.width() / _width_base * 100)) / 100;
				var pery = Math.round(((_base.height() + _utils.getNum(_base.css("marginTop"))) / _height_base * 100)) / 100;

				_container
				.css({"margin-top" : loc.posy, "margin-left" : loc.posx - _utils.getNum(_base.css("paddingLeft"))});

				_svg.select("g")
				.attr("transform", "matrix(" + perx + ", 0, 0, " + pery + ", 0, " + ((_height_base - _height) * 2) + ")");
			}
		});

		setDrugTable();

		_view.view({
			data : _data.data,
			gene : getGenes(d3.selectAll("text")[0], _data.data.pathway_list),
			drug : getDrugs(_data.data.cancer_type)
		});
		// 페이지 로드 전 마우스이벤트로 인한 위치값 오류를 방지하기 위한 코드.
		d3.selectAll("text, rect")
		.attr("class", "");
	}
});