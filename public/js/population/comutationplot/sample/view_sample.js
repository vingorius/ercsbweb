var SAMPLE = "population/comutationplot/sample/";

define(SAMPLE + "view_sample", ["utils", "size", SAMPLE + "event_sample"], function(_utils, _size, _event)	{
	var view = function(_data)	{
		var size = _data.size;
		var svg = _size.mkSvg("#" + _data.class_name + "_sample"
			, (_data.is_patient ? size.width : size.width * size.magnification), size.height);

		var bar_group = svg.selectAll("." + _data.class_name + "_sample_bargroup")
		.data(_data.data)
		.enter().append("g")
		.attr("class", "" + _data.class_name + "_sample_bargroup") 
		.attr("transform", function(_d)	{
			_d.x = _data.x;
			_d.y = _data.y;

			return "translate(" + _data.x(_d.name) + ", 0)";
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
		.style("fill", function(_d) { 
			return _utils.colour(_utils.defMutName(_d.type)); 
		})
		.on("mouseover", _event.m_over)
		.on("mouseout", function(){ 
			_event.m_out(this, "bar");
		});
	}

	var titleView = function(_data)	{
		var size = _data.title_size;
		var svg = _size.mkSvg("#comutationplot_sample_yaxis_title", size.width, size.height);

		var yAxis = d3.svg.axis()
		.scale(_data.y)
		.orient("left")
		.tickValues([0, _data.max / 2, _data.max]);

		var yaxis = svg.append("g")
		.attr("class", "comutationplot_sample_yaxis")
		.attr("transform", "translate(" + (size.width - (size.margin.left / 2)) + ", 0)")
		.call(yAxis);

		yaxis.selectAll("text")
		.style("fill", "#626262").style("font-size", "8px");

		yaxis.selectAll("path, line")
		.style("fill", "none").style("stroke", "#BFBFBF").style("stroke-width", "1px").style("shape-rendering", "crispEdges");

		svg.append("g")
		.data([{ 
			data : _data.data, 
			size : size, 
			status : false 
		}])
		.attr("class", "comutationplot_sample_sort_label")
		.attr("transform", "translate(" + size.margin.left + ", " + (size.height - size.margin.left / 2) + ")")
		.append("text")
		.text("#mutation count")
		.style("fill", "#626262").style("font-size", "11px").style("font-weight", "bold").style("font-style", "italic")
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