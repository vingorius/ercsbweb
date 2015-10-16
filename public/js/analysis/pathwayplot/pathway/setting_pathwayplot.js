define("analysis/pathwayplot/pathway/setting_pathwayplot", ["utils", "size", "analysis/pathwayplot/pathway/view_pathwayplot"], function(_utils, _size, _view)   {
	var getGeneGroup = function(_all_txt, _pathway_list)	{
		var result = [];

		for(var i = 0, len = _all_txt.length ; i < len ; i++)	{
			var item = _all_txt[i];
			var is_gene = _utils.getObject(item.textContent, _pathway_list, "gene_id");

			if(is_gene || (/gene_/i).test(item.parentNode.id))	{
				result.push(d3.select(item.parentNode))
			}
		}
		return result;
	}

	var findDrugGroup = function(_cancer_type)		{
		var all_drugs = d3.selectAll("g[id*='drug_']");
		all_drugs.datum(_cancer_type);
		all_drugs.attr("cursor", "pointer");

		return all_drugs;
	}

	var setColumn = function(_class, _field, _title, _func)		{
		var column_set = {
			class : _class,
			field : _field,
			title : _title,
			formatter : _func,
		};
		return addColumnLoop(column_set, arguments);
	}

	var addColumnLoop = function(_obj, _arguments)	{
		var add_columns = [ "halign", "valign", "align" ];

		for(var i = 4, len = _arguments.length ; i < len ; i++)	{
			_obj[add_columns[i - 4]] = _arguments[i];
		}
		return _obj;
	}

	var setDrugTable = function()	{
		var table = $("#pathwayplot_table");
		var agent = setColumn("drug_modal_agent", "agent", "Drug", agentFormatter, "center", "middle");
		var drug_class = setColumn("drug_modal_drug_class", "drug_class", "Levels of approval", approvedFormatter, "center", "middle", "center");
		var cancer = setColumn("drug_modal_cancer", "cancer", "Treated Cancer", cancerFormatter, "center", "middle");
		var reference = setColumn("drug_modal_reference", "source", "Reference", referenceFormatter, "center", "middle");

		table.bootstrapTable({
			url : "",
			height : "auto",
			cache : false,
			columns : [ agent, drug_class, cancer, reference ]
		})
		.on("load-success.bs.table", function()	{
			$(".drug_modal")
			.css("top", 0).css("left", 0)
			.draggable({
				handle : ".modal-header"
			})
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

	var getDrugClass = function(_drug_type)	{
		return {
			"type1" : { class : "agent-red", color : "red" },
			"type2" : { class : "agent-blue", color : "blue" },
			"type3" : { class : "agent-black", color : "black" }
		}[_drug_type];
	}

	var checkDrugUrl = function(_row)	{
		var nci = _row.nci_id;
		var daily = _row.dailymed_id;

		if(nci)	{
			return 'http://www.cancer.gov/about-cancer/treatment/drugs/' + nci;
		}
		else if(!nci)	{
			return 'http://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=' + daily;
		}
		else	{
			return null;
		}
	}
	
	var agentFormatter = function(_value, _row)	{
		var drug = getDrugClass(_row.drug_type);
		var drug_icon = document.getElementById("legend_icon_" + drug.color).cloneNode(true);
		var svg = document.createElement("svg");
		var icon_size = 15;
		var url = checkDrugUrl(_row);

		svg.setAttribute("id", "pathway_modal_drug_icon")
		svg.setAttribute("width", icon_size);
		svg.setAttribute("height", icon_size);
		drug_icon.setAttribute("transform", "matrix(0.023, 0, 0, 0.032, 0, 0)");
		svg.appendChild(drug_icon);

		if(url != null)	{
			return svg.outerHTML + "<a href=" + url + " target=\'drug\'><span class='underline " + drug.class + "'>" + _value + "</span></a>";
		}
		else {
			return svg.outerHTML + "<span class='" + drug.class + "'>" + _value + "</span>";
		}
	}

	var approvedFormatter = function(_value, _row)	{
		return _value;
	}

	var cancerFormatter = function(_value, _row)	{
		var value = _value === null ? "NA" : _value;
		return "<span title='" + value + "'>" + value + "</span>";
	}

	var referenceFormatter = function(_value, _row)	{
		return "<span title='" + _value + "'>" + _value + "</span>";
	}
	// 추후 수정 필요. svg 를 가운데 놓는 코드.
	var resizePathway = function()	{
		var svg = d3.select("#svg4601");
		var view_width = +svg.attr("width"), view_height = +svg.attr("height");
		var win_width = window.screen.width, win_height = window.screen.height;
		var init = initSize(document.querySelector("#svg4601").getBoundingClientRect(), view_width, view_height, win_width, win_height);
		var container = $(".chart_container");
		
		container
		.css("margin-top", init.y === 0 ? 50 : init.y)
		.css("margin-left", init.x);

		window.onresize = function(_e)	{
			var that = $(this);
			var dyn_width = that.width() + 2;
			var dyn_height = that.height() ;
			var per_width = Math.round((dyn_width / win_width * 100)) / 100;
			var per_height = Math.round((dyn_height / win_height * 100)) / 100;

			per_width = per_width < 0.77 ? 0.77 : per_width;
			per_height = per_height < 0.79 ? 0.79 : per_height;

			container
			.css("margin-top", init.y === 0 ? 50 : init.y)
			.css("margin-left", init.x);
			
			svg.select("g")
			.attr("transform", "matrix(" + per_width + ", 0, 0, " + per_height + ", 0, " + ((win_height - view_height) * per_height) + ")");
		};
	}

	var initSize = function(_svg, _s_width, _s_height, _w_width, _w_height)	{
		var client_width = _svg.left, client_height = _svg.top;
		var init_width = (_w_width / 2) - (_s_width / 2);
		var init_height = (_w_height / 2) - (_s_height / 2);

		return {
			x : init_width / 2,
			y : client_height / 2,
		}
	}
	return function(_data)	{
		resizePathway();
		setDrugTable();
		
		_view.view({
			data : _data.data,
			gene : getGeneGroup(d3.selectAll("text")[0], _data.data.pathway_list),
			drug : findDrugGroup(_data.data.cancer_type)
		});
	}
});