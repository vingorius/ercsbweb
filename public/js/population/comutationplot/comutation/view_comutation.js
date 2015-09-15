var COMUTATION = "population/comutationplot/comutation/";
var VO = "population/comutationplot/vo_comutationplot";

define(COMUTATION + "view_comutation", ["utils", "size", COMUTATION + "event_comutation", VO], function(_utils, _size, _event, _VO)	{
	var getAlteration = function(_type)	{
		var type = _utils.defMutName(_type);

		return alteration = _utils.alterationPrecedence(type);
	}

	var view = function(_data)	{
		var size = _data.size;
		var vo = _VO.VO;

		$("#" + _data.class_name + "_heatmap").width(size.width * size.magnification);

		var svg = _size.mkSvg("#" + _data.class_name + "_heatmap"
			, (_data.is_patient ? size.width : size.width * size.magnification), size.height);

		var yAxis = d3.svg.axis()
		.scale(_data.y)
		.orient("left");

		svg.append("g")
		.attr("class", "comutationplot_heatmap_yaxis")
		.attr("transform", "translate(0, 0)")
		.call(yAxis)
		.select("path")
		.style("stroke", "none");

		var cell_group = svg.selectAll("." + _data.class_name + "_cellgroup")
		.data(_data.all_data)
		.enter().append("g")
		.attr("class", _data.class_name + "_cellgroup")
		.attr("transform", function(_d, _i)	{
			var target = $(this)[0];
			var parent = target.parentNode;

			_d.x = _data.x;
			_d.y = _data.y;

			if(getAlteration(_d.type).alteration === "Somatic Mutaion")	{
				parent.appendChild(target);
			}
			return "translate(" + _data.x(_d.sample) + ", " + _data.y(_d.gene) +")";
		});

		var cell = cell_group.append("rect")
		.attr("class", function(_d) {
			return "" + _data.class_name + "_cells " + _d.sample + "-" + _d.gene;	
		})
		.attr("x", 0)
		.attr("y", function(_d)	{
			if(getAlteration(_d.type).alteration === "CNV")	{
				return 0;
			} 
			else {
				return (_data.y.rangeBand() / 2) - ((_data.y.rangeBand() / 2.5) / 2); 
			}
		})
		.style("stroke", function(_d) { 
			return "#fff"; 
		})
		.style("stroke-width", function(_d) { 
			return 0;
		})
		.style("fill", function(_d) { 
			return _utils.colour(_utils.defMutName(_d.type)); 
		})
		.on("mouseover", _event.m_over)
		.on("mouseout", _event.m_out)
		.attr("width", _data.is_patient ? _data.x.rangeBand() : _data.x.rangeBand() / size.left_between)
		.attr("height", function(_d) {
			if(getAlteration(_d.type).alteration === "CNV")	{
				_d.sign = 0;
				return _data.y.rangeBand() / size.top_between; 
			} 
			else {
				_d.sign = 2;
				return (_data.y.rangeBand() / 3) / size.top_between; 
			}
		});

		_event.move_scroll();
	}

	return {
		view : view
	}
});