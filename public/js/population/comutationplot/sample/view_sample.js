var SAMPLE = "population/comutationplot/sample/";

define(SAMPLE + "view_sample", ["utils", "size", SAMPLE + "event_sample"], function(_utils, _size, _event)	{
	var view = function(_data)	{
		var size = _data.size;

		var svg = d3.select("#" + _data.class_name + "_sample")
		.append("svg")
		.attr("class", _data.class_name + "_sample")
		.attr("width", _data.is_patient ? size.width : size.width * size.magnification)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var bar_group = svg.selectAll("." + _data.class_name + "_sample_bargroup")
		.data(_data.data)
		.enter().append("g")
		.attr("class", "" + _data.class_name + "_sample_bargroup") 
		.attr("transform", function(_d)	{
			_d.x = _data.x;
			_d.y = _data.y;

			return "translate(" + _data.x(_d.sample) + ", 0)";
		});

		var stacked_bar = bar_group.selectAll("rect")  
		.data(function(_d)  {
			return _d.types; 
		})
		.enter().append("rect")
		.attr("class", _data.class_name + "_sample_bars")
		.attr("x", 0)
		.attr("y", function(_d) { 
			return _data.y(_d.start + _d.count); 
		})
		.attr("width", _data.is_patient ? _data.x.rangeBand() : _data.x.rangeBand() / size.left_between)
		.attr("height", function(_d) { 
			return (size.height - (size.margin.bottom / 2)) - _data.y(_d.count); 
		})
		// .style("stroke", function(_d) { 
		// 	return _utils.colour(_utils.define_mutation_name(_d.type)); 
		// })
		// .style("stroke-width", function(_d) { 
		// 	return 0.1;
		// })
		.style("fill", function(_d) { 
			return _utils.colour(_utils.definitionMutationName(_d.type)); 
		})
		.on("mouseover", _event.m_over)
		.on("mouseout", function(){ 
			_event.m_out(this, "bar");
		});
	}

	var titleView = function(_data)	{
		var size = _data.title_size;

		var svg = d3.select("#comutationplot_sample_yaxis_title")
		.append("svg")
		.attr("class", "comutationplot_sample_yaxis_title")
		.attr("width", size.width)
		.attr("height", size.height)
		.append("g")
		.attr("transform", "translate(0, 0)");

		var yAxis = d3.svg.axis()
		.scale(_data.y)
		.orient("left")
		.tickValues([0, _data.max / 2, _data.max]);

		svg.append("g")
		.attr("class", "comutationplot_sample_yaxis")
		.attr("transform", "translate(" + (size.width - (size.margin.left / 2)) + ", 0)")
		.call(yAxis);

		svg.append("g")
		.data([{ 
			data : _data.data, 
			size : size, 
			status : false 
		}])
		.attr("class", "sample_explain")
		.attr("transform", "translate(" + size.margin.left + ", " + (size.height - size.margin.left / 2) + ")")
		.append("text")
		.text("#mutation count")
		.on("mouseover", _event.e_over)
		.on("mouseout", function()	{
			_event.m_out(this, "bar");
		})
		.on("click", _event.sortByValue);
	}

	return {
		view : view,
		titleView : titleView
	}
});