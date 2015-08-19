var COMUTATION = "population/comutationplot/comutation/";
var VO = "population/comutationplot/vo_comutationplot";

define(COMUTATION + "view_comutation", ["utils", "size", COMUTATION + "event_comutation", VO], function(_utils, _size, _event, _VO)	{
	var view = function(_data)	{
		var data = _data || [];
		var size = data.size;
		var e = _event || null;
		var vo = _VO.VO;

		var svg = d3.select("#comutationplot_heatmap")
		.append("svg")
		.attr("class", "comutationplot_heatmap")
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var yAxis = d3.svg.axis()
		.scale(data.y)
		.orient("left");

		svg.append("g")
		.attr("class", "comutationplot_yaxis")
		.attr("transform", "translate(0, 0)")
		.call(yAxis);

		var patient_path = svg.append("path")
		.attr("class", "comutationplot_patient_path")
		.attr("d", function(_d)	{
			var patient = vo.getPatient();
			patient = data.x(patient[patient.length - 1].sample) + data.x.rangeBand();
			return "M " + patient + " 0 L " + patient + " " + size.height;
		});

		var cell_group = svg.selectAll(".comutationplot_cellgroup")
		.data(data.all_data)
		.enter().append("g")
		.attr("class", "comutationplot_cellgroup")
		.attr("transform", function(_d)	{
			_d.x = data.x;
			_d.y = data.y;
			return "translate(" + data.x(_d.sample) + ", " + data.y(_d.gene) +")";
		});

		var cell = cell_group.append("rect")
		.attr("class", "comutationplot_cells")
		.attr("x", 0)
		.attr("y", 0)
		.style("stroke", function(_d) { 
			return _utils.colour(_utils.define_mutation_name(_d.type)); 
		})
		.style("fill", function(_d) { 
			return _utils.colour(_utils.define_mutation_name(_d.type)); 
		})
		.style("stroke-width", function(_d) { 
			return 0.1;
		})
		.on("mouseover", e.m_over)
		.on("mouseout", e.m_out)
		.attr("width", function(_d) { 
			return data.x.rangeBand() * 0.8; 
		})
		.attr("height", function(_d) { 
			return data.y.rangeBand() / 1.2; 
		});

		e.move_scroll();
	}
	return {
		view : view
	}
});